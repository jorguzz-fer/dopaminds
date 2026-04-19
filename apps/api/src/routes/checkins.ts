import type { FastifyInstance } from "fastify";
import { eq, and } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "../db/index.js";
import { users, dailyCheckins } from "../db/schema/index.js";
import { requireSession } from "../middleware/session.js";
import { createCryptoService } from "../crypto/envelope.js";
import { getPhaseForDay } from "@dopamind/science";

const crypto = createCryptoService(
  process.env.MASTER_ENCRYPTION_KEY!,
  process.env.HMAC_SECRET!,
);

function getLocalDateString(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function dateDiffDays(a: string, b: string): number {
  return Math.round(
    (new Date(a).getTime() - new Date(b).getTime()) / 86400000,
  );
}

function calculateNewStreak(
  current: number,
  lastCheckIn: Date | null,
  relapsed: boolean,
  tz: string,
): number {
  if (relapsed) return 0;
  if (!lastCheckIn) return 1;
  const todayStr = getLocalDateString(new Date(), tz);
  const lastStr = getLocalDateString(lastCheckIn, tz);
  const diff = dateDiffDays(todayStr, lastStr);
  if (diff === 1) return current + 1;
  if (diff === 0) return current;
  return 1;
}

const checkinSchema = z.object({
  moodScore: z.number().int().min(1).max(5),
  urgeLevel: z.number().int().min(1).max(10),
  urgeTriggers: z.array(z.string()),
  healthyActivities: z.array(z.string()),
  relapse: z.boolean(),
  relapseDuration: z.number().int().nullable(),
  reflection: z.string().nullable(),
});

export async function checkinRoutes(app: FastifyInstance) {
  // POST /api/checkins
  app.post(
    "/api/checkins",
    { preHandler: requireSession },
    async (request, reply) => {
      const authUserId = (request as any).user.id as string;

      const parseResult = checkinSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: parseResult.error.message });
      }
      const body = parseResult.data;

      // Get profile
      let profile = await db.query.users.findFirst({
        where: eq(users.betterAuthUserId, authUserId),
      });

      if (!profile) {
        const [inserted] = await db
          .insert(users)
          .values({ betterAuthUserId: authUserId, anonymous: true })
          .returning();
        profile = inserted;
      }

      const tz = profile.timezone ?? "UTC";
      const todayStr = getLocalDateString(new Date(), tz);

      // Check if check-in already exists for today
      const existing = await db.query.dailyCheckins.findFirst({
        where: and(
          eq(dailyCheckins.userId, profile.id),
          eq(dailyCheckins.date, todayStr),
        ),
      });

      if (existing) {
        return reply.status(409).send({ error: "Check-in already exists for today" });
      }

      // Calculate new streak
      const newStreak = calculateNewStreak(
        profile.streakDays,
        profile.lastCheckIn,
        body.relapse,
        tz,
      );

      // Compute phase
      const newPhase = getPhaseForDay(newStreak);

      // Encrypt sensitive data
      const sensitiveBlob = JSON.stringify({
        urgeTriggers: body.urgeTriggers,
        healthyActivities: body.healthyActivities,
        reflection: body.reflection,
      });
      const { ciphertext, encryptedDataKey } = crypto.encrypt(sensitiveBlob);

      // Insert check-in
      const [checkin] = await db
        .insert(dailyCheckins)
        .values({
          userId: profile.id,
          date: todayStr,
          moodScore: body.moodScore,
          urgeLevel: body.urgeLevel,
          urgeTriggers: ciphertext,
          healthyActivities: null,
          relapse: body.relapse,
          relapseDuration: body.relapseDuration,
          reflection: null,
          encryptedDataKey,
          phase: newPhase,
        })
        .returning();

      // Update user
      await db
        .update(users)
        .set({
          streakDays: newStreak,
          lastCheckIn: new Date(),
          currentPhase: newPhase,
        })
        .where(eq(users.id, profile.id));

      return reply.send({
        id: checkin.id,
        date: checkin.date,
        phase: newPhase,
        streakDays: newStreak,
        isFirstToday: true,
      });
    },
  );

  // GET /api/checkins/today
  app.get(
    "/api/checkins/today",
    { preHandler: requireSession },
    async (request, reply) => {
      const authUserId = (request as any).user.id as string;

      // Get profile
      let profile = await db.query.users.findFirst({
        where: eq(users.betterAuthUserId, authUserId),
      });

      if (!profile) {
        const [inserted] = await db
          .insert(users)
          .values({ betterAuthUserId: authUserId, anonymous: true })
          .returning();
        profile = inserted;
      }

      const tz = profile.timezone ?? "UTC";
      const todayStr = getLocalDateString(new Date(), tz);

      const checkin = await db.query.dailyCheckins.findFirst({
        where: and(
          eq(dailyCheckins.userId, profile.id),
          eq(dailyCheckins.date, todayStr),
        ),
      });

      if (!checkin) {
        return reply.send(null);
      }

      // Decrypt urgeTriggers
      let urgeTriggers: string[] = [];
      let healthyActivities: string[] = [];
      let reflection: string | null = null;

      if (checkin.urgeTriggers != null && checkin.encryptedDataKey != null) {
        try {
          const plaintext = crypto.decrypt(
            checkin.urgeTriggers,
            checkin.encryptedDataKey,
          );
          const parsed = JSON.parse(plaintext) as {
            urgeTriggers?: string[];
            healthyActivities?: string[];
            reflection?: string | null;
          };
          urgeTriggers = parsed.urgeTriggers ?? [];
          healthyActivities = parsed.healthyActivities ?? [];
          reflection = parsed.reflection ?? null;
        } catch {
          // leave empty on decryption failure
        }
      }

      return reply.send({
        id: checkin.id,
        date: checkin.date,
        moodScore: checkin.moodScore,
        urgeLevel: checkin.urgeLevel,
        urgeTriggers,
        healthyActivities,
        relapse: checkin.relapse,
        relapseDuration: checkin.relapseDuration,
        reflection,
        phase: checkin.phase,
        streakDays: profile.streakDays,
      });
    },
  );
}

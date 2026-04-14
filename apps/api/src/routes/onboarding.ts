import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "../db/index.js";
import { users, userAddictions } from "../db/schema/index.js";
import { requireSession } from "../middleware/session.js";
import { createCryptoService } from "../crypto/envelope.js";
import { calculateSeverityScore } from "@dopamind/science";

const crypto = createCryptoService(
  process.env.MASTER_ENCRYPTION_KEY!,
  process.env.HMAC_SECRET!,
);

const onboardingSchema = z.object({
  category: z.enum(["social_media", "pornography", "gaming", "shopping"]),
  hoursPerDay: z.number().min(0.5).max(24),
  failedAttempts: z.number().int().min(0),
  negativeConsequences: z.boolean(),
  withdrawalSymptoms: z.boolean(),
  interferesWithLife: z.boolean(),
  dailyUsageGoalHours: z.number().min(0).max(24),
  timezone: z.string().max(64),
});

export async function onboardingRoutes(app: FastifyInstance) {
  app.post(
    "/api/onboarding",
    { preHandler: requireSession },
    async (request, reply) => {
      const authUserId = (request as any).user.id as string;

      // Parse and validate body
      const parseResult = onboardingSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({ error: parseResult.error.message });
      }
      const body = parseResult.data;

      // Upsert profile
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

      if (profile.onboardingDone) {
        return reply.status(409).send({ error: "Onboarding já foi concluído" });
      }

      // Compute severity score
      const severityScore = calculateSeverityScore({
        hoursPerDay: body.hoursPerDay,
        failedAttempts: body.failedAttempts,
        negativeConsequences: body.negativeConsequences,
        withdrawalSymptoms: body.withdrawalSymptoms,
        interferesWithLife: body.interferesWithLife,
      });

      // Encrypt blob
      const blob = JSON.stringify({
        baselineUsage: { hoursPerDay: body.hoursPerDay },
        currentGoal: { dailyUsageGoalHours: body.dailyUsageGoalHours },
      });
      const { ciphertext, encryptedDataKey } = crypto.encrypt(blob);

      // Insert addiction
      const [addiction] = await db
        .insert(userAddictions)
        .values({
          userId: profile.id,
          category: body.category,
          severityScore,
          baselineUsage: ciphertext,
          currentGoal: null,
          encryptedDataKey,
        })
        .returning();

      // Update user
      await db
        .update(users)
        .set({
          onboardingDone: true,
          timezone: body.timezone,
          currentPhase: 1,
          streakDays: 0,
        })
        .where(eq(users.id, profile.id));

      return reply.send({
        success: true,
        addictionId: addiction.id,
        severityScore,
        currentPhase: 1,
      });
    },
  );
}

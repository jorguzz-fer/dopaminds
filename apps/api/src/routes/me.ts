import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, userAddictions } from "../db/schema/index.js";
import { requireSession } from "../middleware/session.js";
import { createCryptoService } from "../crypto/envelope.js";

const crypto = createCryptoService(
  process.env.MASTER_ENCRYPTION_KEY!,
  process.env.HMAC_SECRET!,
);

export async function meRoutes(app: FastifyInstance) {
  app.get("/api/me", { preHandler: requireSession }, async (request, reply) => {
    const authUserId = (request as any).user.id as string;

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

    // Load addictions
    const addictions = await db.query.userAddictions.findMany({
      where: eq(userAddictions.userId, profile.id),
    });

    const decryptedAddictions = addictions.map((addiction) => {
      let baselineUsage: Record<string, unknown> | null = null;
      let currentGoal: Record<string, unknown> | null = null;

      if (addiction.baselineUsage != null && addiction.encryptedDataKey != null) {
        try {
          const plaintext = crypto.decrypt(
            addiction.baselineUsage,
            addiction.encryptedDataKey,
          );
          const parsed = JSON.parse(plaintext) as {
            baselineUsage?: Record<string, unknown>;
            currentGoal?: Record<string, unknown>;
          };
          baselineUsage = parsed.baselineUsage ?? null;
          currentGoal = parsed.currentGoal ?? null;
        } catch {
          // leave null on decryption failure
        }
      }

      return {
        id: addiction.id,
        category: addiction.category,
        severityScore: addiction.severityScore,
        baselineUsage,
        currentGoal,
        startedAt: addiction.startedAt.toISOString(),
      };
    });

    return reply.send({
      id: profile.id,
      anonymous: profile.anonymous,
      onboardingDone: profile.onboardingDone,
      currentPhase: profile.currentPhase,
      streakDays: profile.streakDays,
      lastCheckIn: profile.lastCheckIn ? profile.lastCheckIn.toISOString() : null,
      timezone: profile.timezone,
      addictions: decryptedAddictions,
    });
  });
}

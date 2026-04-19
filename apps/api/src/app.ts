import Fastify, { type FastifyError } from "fastify";
import { registerHelmet } from "./plugins/helmet.js";
import { registerCors } from "./plugins/cors.js";
import { registerRateLimit } from "./plugins/rate-limit.js";
import { registerCookie } from "./plugins/cookie.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { meRoutes } from "./routes/me.js";
import { onboardingRoutes } from "./routes/onboarding.js";
import { checkinRoutes } from "./routes/checkins.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    },
    trustProxy: true,
  });

  // Security plugins
  await registerHelmet(app);
  await registerCors(app);
  await registerRateLimit(app);
  await registerCookie(app);

  // Error handler — never expose internals
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode ?? 500;
    reply.status(statusCode).send({
      statusCode,
      error: statusCode >= 500 ? "Internal Server Error" : error.message,
    });
  });

  // Routes
  await app.register(healthRoutes);
  // Auth routes (Better Auth catch-all)
  await app.register(authRoutes);
  await app.register(meRoutes);
  await app.register(onboardingRoutes);
  await app.register(checkinRoutes);

  return app;
}

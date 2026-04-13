import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export async function registerCors(app: FastifyInstance) {
  const origin = process.env.CLIENT_ORIGIN;
  if (!origin) throw new Error("CLIENT_ORIGIN env var is required");

  await app.register(cors, {
    origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  });
}

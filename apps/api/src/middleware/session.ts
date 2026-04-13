import type { FastifyRequest, FastifyReply } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export async function requireSession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  // Attach session to request for downstream use
  (request as any).session = session.session;
  (request as any).user = session.user;
}

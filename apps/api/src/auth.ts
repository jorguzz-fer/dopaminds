import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { db } from "./db/index.js";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) throw new Error("BETTER_AUTH_SECRET env var is required");

const clientOrigin = process.env.CLIENT_ORIGIN;
if (!clientOrigin) throw new Error("CLIENT_ORIGIN env var is required");

export const auth = betterAuth({
  secret,
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // Data migration from anonymous → linked account happens here
        // Check-ins, progress, AI sessions are already linked by user_id
        // Better Auth handles the user record merge
        console.log(
          `Linked anonymous user ${anonymousUser.id} to ${newUser.id}`,
        );
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  advanced: {
    cookiePrefix: "dopamind",
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    },
  },
  trustedOrigins: [clientOrigin],
});

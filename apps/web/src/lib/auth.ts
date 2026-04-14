import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

type AuthClient = ReturnType<typeof createAuthClient<{ plugins: [ReturnType<typeof anonymousClient>] }>>;

export const authClient: AuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? window.location.origin,
  plugins: [anonymousClient()],
});

export const useSession: AuthClient["useSession"] = authClient.useSession;
export const signIn: AuthClient["signIn"] = authClient.signIn;
export const signUp: AuthClient["signUp"] = authClient.signUp;
export const signOut: AuthClient["signOut"] = authClient.signOut;

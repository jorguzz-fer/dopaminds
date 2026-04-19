import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useSession, signIn } from "../lib/auth";
import { useAppStore } from "../store/useAppStore";

export function AuthGuard() {
  const { data: session, isPending } = useSession();
  const { user, isLoadingUser, refreshUser } = useAppStore();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!isPending && !session && !signingIn) {
      setSigningIn(true);
      signIn.anonymous().then(() => {
        refreshUser();
        setSigningIn(false);
      });
    } else if (session && isLoadingUser === false && !user) {
      refreshUser();
    }
  }, [isPending, session]);

  if (isPending || isLoadingUser || signingIn || (!user && session)) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <Navigate to={user.onboardingDone ? "/dashboard" : "/onboarding"} replace />;
}

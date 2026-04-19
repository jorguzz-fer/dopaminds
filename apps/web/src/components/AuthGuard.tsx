import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useSession, signIn } from "../lib/auth";
import { useAppStore } from "../store/useAppStore";
import { BrainCircuit } from "lucide-react";

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
    return <SplashScreen />;
  }

  if (!user) return null;

  return <Navigate to={user.onboardingDone ? "/dashboard" : "/onboarding"} replace />;
}

function SplashScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-8 text-center animate-[fadeInUp_0.6s_ease-out_both]">
      <div className="relative">
        <div className="absolute inset-0 -m-8 rounded-full bg-violet-500/20 blur-2xl animate-pulse-soft" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-600 shadow-[0_12px_40px_-8px_rgba(147,51,234,0.6)]">
          <BrainCircuit className="h-10 w-10 text-white" strokeWidth={1.75} />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Dopa<span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">Mind</span>
        </h1>
        <p className="text-sm text-white/50 max-w-xs leading-relaxed">
          Reset consciente do sistema de recompensa cerebral
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
      </div>
    </div>
  );
}

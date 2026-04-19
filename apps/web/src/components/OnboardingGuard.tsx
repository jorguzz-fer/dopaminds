import { Navigate, Outlet } from "react-router";
import { useAppStore } from "../store/useAppStore";

export function OnboardingGuard() {
  const { user, isLoadingUser } = useAppStore();

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
      </div>
    );
  }

  if (!user?.onboardingDone) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

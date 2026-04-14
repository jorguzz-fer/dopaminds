import { Navigate, Outlet } from "react-router";
import { useAppStore } from "../store/useAppStore";

export function OnboardingGuard() {
  const { user, isLoadingUser } = useAppStore();

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.onboardingDone) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

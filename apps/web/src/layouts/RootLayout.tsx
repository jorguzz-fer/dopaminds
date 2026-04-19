import { Outlet } from "react-router";
import { useAppStore } from "../store/useAppStore";
import { useEffect } from "react";
import { BottomNav } from "../components/BottomNav";
import { AmbientBackground } from "@dopamind/ui";

export function RootLayout() {
  const refreshUser = useAppStore((s) => s.refreshUser);

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="min-h-screen text-white antialiased selection:bg-violet-500/30 selection:text-white">
      <AmbientBackground variant="mountain" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}

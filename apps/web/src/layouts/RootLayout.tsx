import { Outlet } from "react-router";
import { useAppStore } from "../store/useAppStore";
import { useEffect } from "react";
import { BottomNav } from "../components/BottomNav";

export function RootLayout() {
  const refreshUser = useAppStore((s) => s.refreshUser);

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Outlet />
      <BottomNav />
    </div>
  );
}

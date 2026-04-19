import { useLocation, useNavigate } from "react-router";
import { Home, ClipboardCheck } from "lucide-react";
import { cn } from "@dopamind/ui";
import { useAppStore } from "../store/useAppStore";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Início", icon: Home },
  { path: "/checkin", label: "Check-in", icon: ClipboardCheck },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);

  if (!user?.onboardingDone) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex w-full items-center gap-1 rounded-full border border-white/10 bg-[var(--color-surface-2)]/75 p-1.5 backdrop-blur-2xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)]">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[12px] font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_6px_20px_-6px_rgba(147,51,234,0.55)]"
                  : "text-white/55 hover:text-white/80",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

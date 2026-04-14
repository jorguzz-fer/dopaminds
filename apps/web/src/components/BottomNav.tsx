import { useLocation, useNavigate } from "react-router";
import { getPhaseColor } from "../lib/phaseColors";
import { useAppStore } from "../store/useAppStore";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Início", icon: "🏠" },
  { path: "/checkin", label: "Check-in", icon: "✅" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);

  if (!user?.onboardingDone) return null;

  const phase = user.currentPhase;
  const color = getPhaseColor(phase);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex border-t border-white/10 bg-[#111118]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-opacity duration-150"
            style={{ opacity: active ? 1 : 0.45 }}
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: active ? color : "inherit" }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

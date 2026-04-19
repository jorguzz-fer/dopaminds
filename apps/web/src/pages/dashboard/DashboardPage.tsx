import { useEffect, useState } from "react";
import { Bell, Trophy } from "lucide-react";
import { IconButton } from "@dopamind/ui";
import { useAppStore } from "../../store/useAppStore";
import { apiFetch } from "../../lib/api";
import { StreakCard } from "./components/StreakCard";
import { PhaseCard } from "./components/PhaseCard";
import { AddictionSummaryCard } from "./components/AddictionSummaryCard";
import { CheckinCTA } from "./components/CheckinCTA";
import { AccountUpgradeSheet } from "../../components/AccountUpgradeSheet";

function getGreeting(): { label: string; time: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { label: "guerreiro", time: "Bom dia" };
  if (hour < 18) return { label: "guerreiro", time: "Boa tarde" };
  return { label: "guerreiro", time: "Boa noite" };
}

const formattedDate = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

export function DashboardPage() {
  const { user } = useAppStore();

  const [todayCheckin, setTodayCheckin] = useState<unknown>(null);
  const [loadingCheckin, setLoadingCheckin] = useState(true);

  const [showUpgradeSheet, setShowUpgradeSheet] = useState(false);

  useEffect(() => {
    apiFetch<unknown>("/api/checkins/today")
      .then((data) => {
        setTodayCheckin(data);
        setLoadingCheckin(false);
      })
      .catch(() => setLoadingCheckin(false));
  }, []);

  useEffect(() => {
    if (user?.anonymous && user?.onboardingDone) {
      const shown = localStorage.getItem("dopamind:upgrade_prompt_shown");
      if (!shown) {
        const t = setTimeout(() => setShowUpgradeSheet(true), 1500);
        return () => clearTimeout(t);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
      </div>
    );
  }

  const { label, time } = getGreeting();

  return (
    <div className="flex min-h-screen flex-col pb-28">
      <header
        className="flex items-center gap-3 px-5 pb-3 pt-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)" }}
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-semibold text-white shadow-[0_6px_20px_-6px_rgba(147,51,234,0.6)]">
          {user.anonymous ? "D" : "🙂"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] uppercase tracking-[0.22em] text-white/40 capitalize">
            {formattedDate}
          </p>
          <h1 className="text-xl font-semibold leading-tight text-white">
            {time}, {label}.
          </h1>
        </div>

        <IconButton icon={<Trophy />} label="Conquistas" variant="default" />
        <IconButton icon={<Bell />} label="Notificações" variant="default" />
      </header>

      <div className="mt-4 flex flex-col gap-4 px-5">
        <div className="animate-fade-in-up" style={{ animationDelay: "40ms" }}>
          <StreakCard streakDays={user.streakDays} phase={user.currentPhase} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <PhaseCard phase={user.currentPhase} streakDays={user.streakDays} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <AddictionSummaryCard addictions={user.addictions} phase={user.currentPhase} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "280ms" }}>
          <CheckinCTA
            hasCheckedInToday={!!todayCheckin}
            phase={user.currentPhase}
            loading={loadingCheckin}
          />
        </div>
      </div>

      <AccountUpgradeSheet isOpen={showUpgradeSheet} onClose={() => setShowUpgradeSheet(false)} />
    </div>
  );
}

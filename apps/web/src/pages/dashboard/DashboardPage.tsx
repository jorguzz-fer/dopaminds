import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { apiFetch } from "../../lib/api";
import { StreakCard } from "./components/StreakCard";
import { PhaseCard } from "./components/PhaseCard";
import { AddictionSummaryCard } from "./components/AddictionSummaryCard";
import { CheckinCTA } from "./components/CheckinCTA";
import { AccountUpgradeSheet } from "../../components/AccountUpgradeSheet";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia, guerreiro.";
  if (hour < 18) return "Boa tarde, guerreiro.";
  return "Boa noite, guerreiro.";
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
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <p className="text-white/40 text-sm capitalize">{formattedDate}</p>
        <h1 className="text-2xl font-bold text-white mt-1">{getGreeting()}</h1>
      </div>

      {/* Cards */}
      <div className="px-4 space-y-3">
        <StreakCard streakDays={user.streakDays} phase={user.currentPhase} />
        <PhaseCard phase={user.currentPhase} streakDays={user.streakDays} />
        <AddictionSummaryCard addictions={user.addictions} phase={user.currentPhase} />
        <CheckinCTA
          hasCheckedInToday={!!todayCheckin}
          phase={user.currentPhase}
          loading={loadingCheckin}
        />
      </div>

      {/* Upgrade sheet (anonymous users) */}
      <AccountUpgradeSheet
        isOpen={showUpgradeSheet}
        onClose={() => setShowUpgradeSheet(false)}
      />
    </div>
  );
}

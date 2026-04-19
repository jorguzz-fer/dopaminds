import { Card, StreakDisplay } from "@dopamind/ui";
import { Flame } from "lucide-react";
import { getPhaseColor } from "../../../lib/phaseColors";

interface StreakCardProps {
  streakDays: number;
  phase: number;
}

export function StreakCard({ streakDays, phase }: StreakCardProps) {
  const color = getPhaseColor(phase);

  return (
    <Card variant="glow" padding="lg" className="text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex flex-col items-center gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl animate-pulse-soft"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${color}44, transparent 70%)`,
          }}
        >
          <Flame className="h-7 w-7" strokeWidth={1.75} style={{ color }} fill={`${color}33`} />
        </div>

        {streakDays === 0 ? (
          <div className="space-y-1">
            <p className="text-white/60 text-sm">Comece hoje</p>
            <p className="text-xl font-semibold text-white">Dia 1 te espera</p>
          </div>
        ) : (
          <StreakDisplay days={streakDays} phase={phase} />
        )}
      </div>
    </Card>
  );
}

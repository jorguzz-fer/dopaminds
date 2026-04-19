import { Card, StreakDisplay } from "@dopamind/ui";
import { getPhaseColor } from "../../../lib/phaseColors";

interface StreakCardProps {
  streakDays: number;
  phase: number;
}

export function StreakCard({ streakDays, phase }: StreakCardProps) {
  return (
    <Card accentColor={getPhaseColor(phase)} className="text-center py-6">
      {streakDays === 0 ? (
        <>
          <div className="text-4xl mb-2">🔥</div>
          <p className="text-white/60 text-sm">Comece hoje</p>
          <p className="text-white font-semibold mt-1">Dia 1 te espera</p>
        </>
      ) : (
        <>
          <div className="text-3xl mb-3">🔥</div>
          <StreakDisplay days={streakDays} phase={phase} />
          <p className="text-white/50 text-xs mt-2 uppercase tracking-widest">dias consecutivos</p>
        </>
      )}
    </Card>
  );
}

import { phaseColor } from "../lib/phaseColors";

interface StreakDisplayProps {
  days: number;
  phase: number;
}

export function StreakDisplay({ days, phase }: StreakDisplayProps) {
  const color = phaseColor(phase);
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-7xl font-bold tabular-nums leading-none bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(140deg, ${color} 0%, #ffffff 55%, ${color}cc 100%)`,
        }}
      >
        {days}
      </span>
      <span className="text-[11px] text-white/50 uppercase tracking-[0.28em] font-medium">
        dias consecutivos
      </span>
    </div>
  );
}

const PHASE_COLORS: Record<number, string> = {
  1: "#FF4444",
  2: "#FFAA00",
  3: "#4499FF",
  4: "#44CC88",
};

interface StreakDisplayProps {
  days: number;
  phase: number;
}

export function StreakDisplay({ days, phase }: StreakDisplayProps) {
  const color = PHASE_COLORS[phase] ?? "#4499FF";
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-6xl font-bold tabular-nums" style={{ color }}>
        {days}
      </span>
      <span className="text-sm text-white/50 uppercase tracking-widest">dias</span>
    </div>
  );
}

interface PhaseChipProps {
  phase: number;
  phaseName: string;
}

const PHASE_COLORS: Record<number, string> = {
  1: "#FF4444",
  2: "#FFAA00",
  3: "#4499FF",
  4: "#44CC88",
};

export function PhaseChip({ phase, phaseName }: PhaseChipProps) {
  const color = PHASE_COLORS[phase] ?? "#4499FF";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      Fase {phase} · {phaseName}
    </span>
  );
}

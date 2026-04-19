import { phaseColor } from "../lib/phaseColors";

interface PhaseChipProps {
  phase: number;
  phaseName: string;
  size?: "sm" | "md";
}

export function PhaseChip({ phase, phaseName, size = "md" }: PhaseChipProps) {
  const color = phaseColor(phase);
  const sizeClass = size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider backdrop-blur-sm ${sizeClass}`}
      style={{ backgroundColor: `${color}22`, color, boxShadow: `inset 0 0 0 1px ${color}44` }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ backgroundColor: color }} />
      Fase {phase} · {phaseName}
    </span>
  );
}

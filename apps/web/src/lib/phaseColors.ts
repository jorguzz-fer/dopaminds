import { phaseColor, PHASE_COLORS } from "@dopamind/ui";

export function getPhaseColor(phase: number): string {
  return phaseColor(phase);
}

export function getPhaseGradient(phase: number): string {
  const color = PHASE_COLORS[phase] ?? PHASE_COLORS[3];
  return `linear-gradient(135deg, ${color}33, ${color}0d)`;
}

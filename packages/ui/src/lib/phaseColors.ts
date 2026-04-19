export const PHASE_COLORS: Record<number, string> = {
  1: "#ff6b7a",
  2: "#ffb347",
  3: "#8b9ff7",
  4: "#6be3b1",
};

export function phaseColor(phase: number): string {
  return PHASE_COLORS[phase] ?? PHASE_COLORS[3];
}

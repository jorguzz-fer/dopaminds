export function getPhaseColor(phase: number): string {
  const colors: Record<number, string> = {
    1: "#FF4444",
    2: "#FFAA00",
    3: "#4499FF",
    4: "#44CC88",
  };
  return colors[phase] ?? "#4499FF";
}

export function getPhaseGradient(phase: number): string {
  const color = getPhaseColor(phase);
  return `linear-gradient(135deg, ${color}22, ${color}08)`;
}

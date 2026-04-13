import { RECOVERY_PHASES } from "@dopamind/shared";

export function getPhaseForDay(day: number): number {
  if (day < 1) return 1;
  for (const phase of RECOVERY_PHASES) {
    const [start, end] = phase.dayRange;
    if (day >= start && day <= end) return phase.phase;
  }
  return RECOVERY_PHASES[RECOVERY_PHASES.length - 1].phase;
}

export function getPhaseProgress(day: number): number {
  if (day < 1) return 0;
  const phaseNum = getPhaseForDay(day);
  const phase = RECOVERY_PHASES.find((p) => p.phase === phaseNum);
  if (!phase) return 0;
  const [start, end] = phase.dayRange;
  const totalDays = end - start + 1;
  const daysIn = Math.min(day - start + 1, totalDays);
  return daysIn / totalDays;
}

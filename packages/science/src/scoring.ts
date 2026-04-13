export interface SeverityInput {
  hoursPerDay: number;
  failedAttempts: number;
  negativeConsequences: boolean;
  withdrawalSymptoms: boolean;
  interferesWithLife: boolean;
}

export function calculateSeverityScore(input: SeverityInput): number {
  let score = 0;

  // Hours per day: 0-2 = 1pt, 3-5 = 2pt, 6+ = 3pt
  if (input.hoursPerDay <= 2) score += 1;
  else if (input.hoursPerDay <= 5) score += 2;
  else score += 3;

  // Failed quit attempts: 0 = 0pt, 1-2 = 1pt, 3+ = 2pt
  if (input.failedAttempts >= 3) score += 2;
  else if (input.failedAttempts >= 1) score += 1;

  // Boolean factors: each adds ~1.5 points
  if (input.negativeConsequences) score += 2;
  if (input.withdrawalSymptoms) score += 1;
  if (input.interferesWithLife) score += 2;

  return Math.max(1, Math.min(10, score));
}

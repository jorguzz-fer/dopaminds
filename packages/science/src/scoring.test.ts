import { describe, it, expect } from "vitest";
import { calculateSeverityScore } from "./scoring.js";

describe("calculateSeverityScore", () => {
  it("returns low severity for minimal usage", () => {
    const score = calculateSeverityScore({
      hoursPerDay: 1,
      failedAttempts: 0,
      negativeConsequences: false,
      withdrawalSymptoms: false,
      interferesWithLife: false,
    });
    expect(score).toBeLessThanOrEqual(3);
    expect(score).toBeGreaterThanOrEqual(1);
  });

  it("returns high severity for heavy usage with consequences", () => {
    const score = calculateSeverityScore({
      hoursPerDay: 8,
      failedAttempts: 5,
      negativeConsequences: true,
      withdrawalSymptoms: true,
      interferesWithLife: true,
    });
    expect(score).toBeGreaterThanOrEqual(8);
    expect(score).toBeLessThanOrEqual(10);
  });

  it("returns moderate severity for mixed signals", () => {
    const score = calculateSeverityScore({
      hoursPerDay: 4,
      failedAttempts: 2,
      negativeConsequences: true,
      withdrawalSymptoms: false,
      interferesWithLife: false,
    });
    expect(score).toBeGreaterThanOrEqual(4);
    expect(score).toBeLessThanOrEqual(7);
  });

  it("clamps score between 1 and 10", () => {
    const low = calculateSeverityScore({
      hoursPerDay: 0,
      failedAttempts: 0,
      negativeConsequences: false,
      withdrawalSymptoms: false,
      interferesWithLife: false,
    });
    expect(low).toBe(1);

    const high = calculateSeverityScore({
      hoursPerDay: 24,
      failedAttempts: 100,
      negativeConsequences: true,
      withdrawalSymptoms: true,
      interferesWithLife: true,
    });
    expect(high).toBe(10);
  });
});

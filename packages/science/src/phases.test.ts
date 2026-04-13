import { describe, it, expect } from "vitest";
import { getPhaseForDay, getPhaseProgress } from "./phases.js";

describe("getPhaseForDay", () => {
  it("returns phase 1 for days 1-3", () => {
    expect(getPhaseForDay(1)).toBe(1);
    expect(getPhaseForDay(3)).toBe(1);
  });

  it("returns phase 2 for days 4-7", () => {
    expect(getPhaseForDay(4)).toBe(2);
    expect(getPhaseForDay(7)).toBe(2);
  });

  it("returns phase 3 for days 8-21", () => {
    expect(getPhaseForDay(8)).toBe(3);
    expect(getPhaseForDay(21)).toBe(3);
  });

  it("returns phase 4 for days 22+", () => {
    expect(getPhaseForDay(22)).toBe(4);
    expect(getPhaseForDay(90)).toBe(4);
    expect(getPhaseForDay(365)).toBe(4);
  });

  it("returns phase 1 for day 0 or negative", () => {
    expect(getPhaseForDay(0)).toBe(1);
    expect(getPhaseForDay(-1)).toBe(1);
  });
});

describe("getPhaseProgress", () => {
  it("returns 0.33 for day 1 in phase 1 (3-day phase)", () => {
    const progress = getPhaseProgress(1);
    expect(progress).toBeCloseTo(0.33, 1);
  });

  it("returns 1.0 for last day of phase 1", () => {
    const progress = getPhaseProgress(3);
    expect(progress).toBeCloseTo(1.0, 1);
  });

  it("returns progress within phase 3", () => {
    const progress = getPhaseProgress(14);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThanOrEqual(1);
  });
});

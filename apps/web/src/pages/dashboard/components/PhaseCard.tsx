import { useState } from "react";
import { Card, PhaseChip, ProgressBar } from "@dopamind/ui";
import { RECOVERY_PHASES } from "@dopamind/shared";
import { getPhaseProgress } from "@dopamind/science";
import { getPhaseColor } from "../../../lib/phaseColors";

interface PhaseCardProps {
  phase: number;
  streakDays: number;
}

export function PhaseCard({ phase, streakDays }: PhaseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const phaseData = RECOVERY_PHASES.find((p) => p.phase === phase) ?? RECOVERY_PHASES[0];
  const progress = getPhaseProgress(streakDays);
  const color = getPhaseColor(phase);

  return (
    <Card accentColor={color}>
      <div className="flex items-center justify-between mb-3">
        <PhaseChip phase={phase} phaseName={phaseData.name} />
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white/40 text-sm"
          type="button"
        >
          {expanded ? "↑" : "↓"}
        </button>
      </div>

      <p className="text-white/80 text-sm mb-3">{phaseData.description}</p>

      <ProgressBar value={progress} color={color} animated={progress < 0.5} />
      <p className="text-white/40 text-xs mt-1.5">
        Dias {phaseData.dayRange[0]}–{phaseData.dayRange[1]}
      </p>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-white/60 text-xs leading-relaxed">{phaseData.neuroscience}</p>
        </div>
      )}
    </Card>
  );
}

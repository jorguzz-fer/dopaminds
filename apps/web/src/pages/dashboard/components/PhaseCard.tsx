import { useState } from "react";
import { Card, PhaseChip, ProgressBar } from "@dopamind/ui";
import { RECOVERY_PHASES } from "@dopamind/shared";
import { getPhaseProgress } from "@dopamind/science";
import { ChevronDown } from "lucide-react";
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
    <Card variant="frosted" accentPhase={phase} padding="md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <PhaseChip phase={phase} phaseName={phaseData.name} />
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition-transform hover:text-white"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
          type="button"
          aria-label={expanded ? "Recolher" : "Expandir"}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>

      <p className="mb-4 text-sm text-white/75 leading-relaxed">{phaseData.description}</p>

      <ProgressBar value={progress} color={color} animated={progress < 0.5} />
      <p className="mt-2 text-[11px] uppercase tracking-widest text-white/40">
        Dias {phaseData.dayRange[0]}–{phaseData.dayRange[1]}
      </p>

      {expanded && (
        <div className="mt-4 border-t border-white/10 pt-4 animate-[fadeInUp_0.3s_ease-out_both]">
          <p className="text-[13px] leading-relaxed text-white/60">{phaseData.neuroscience}</p>
        </div>
      )}
    </Card>
  );
}

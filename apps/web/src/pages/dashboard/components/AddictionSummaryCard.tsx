import { Card } from "@dopamind/ui";
import { ADDICTION_CATEGORIES } from "@dopamind/shared";
import { getPhaseColor } from "../../../lib/phaseColors";
import type { UserAddictionProfile } from "../../../store/useAppStore";

interface AddictionSummaryCardProps {
  addictions: UserAddictionProfile[];
  phase: number;
}

export function AddictionSummaryCard({ addictions, phase }: AddictionSummaryCardProps) {
  if (!addictions || addictions.length === 0) return null;

  const color = getPhaseColor(phase);

  return (
    <Card variant="frosted" padding="md">
      <h3 className="mb-4 text-[11px] uppercase tracking-[0.24em] text-white/40 font-semibold">
        Sua batalha
      </h3>

      <div className="space-y-4">
        {addictions.map((addiction) => {
          const cat = ADDICTION_CATEGORIES[addiction.category];
          return (
            <div key={addiction.id} className="flex items-center gap-3">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl border border-white/10">
                {cat.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-white">{cat.label}</p>
                  <span className="text-[11px] font-medium text-white/45 tabular-nums">
                    {addiction.severityScore}/10
                  </span>
                </div>
                <div className="mt-1.5 flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: i < addiction.severityScore ? color : "rgba(255,255,255,0.08)",
                        boxShadow: i < addiction.severityScore ? `0 0 6px ${color}66` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

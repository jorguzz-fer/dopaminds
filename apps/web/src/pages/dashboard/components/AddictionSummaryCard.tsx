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

  return (
    <Card accentColor={getPhaseColor(phase)} className="space-y-3">
      <h3 className="text-white/60 text-xs uppercase tracking-wider">Sua batalha</h3>
      {addictions.map((addiction) => {
        const cat = ADDICTION_CATEGORIES[addiction.category];
        return (
          <div key={addiction.id} className="flex items-center gap-3">
            <span className="text-2xl">{cat.emoji}</span>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{cat.label}</p>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        i < addiction.severityScore ? getPhaseColor(phase) : "#ffffff18",
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="text-white/40 text-xs">{addiction.severityScore}/10</span>
          </div>
        );
      })}
    </Card>
  );
}

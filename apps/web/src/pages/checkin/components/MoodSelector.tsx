import { getPhaseColor } from "../../../lib/phaseColors";

const MOODS = ["😞", "😟", "😐", "🙂", "😊"];
const MOOD_LABELS = ["Péssimo", "Ruim", "Ok", "Bem", "Ótimo"];

interface MoodSelectorProps {
  value: number;
  onChange: (v: number) => void;
  phase: number;
}

export function MoodSelector({ value, onChange, phase }: MoodSelectorProps) {
  const color = getPhaseColor(phase);
  return (
    <div className="flex justify-between gap-2">
      {MOODS.map((emoji, i) => {
        const score = i + 1;
        const selected = value === score;
        return (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all duration-200"
            style={{
              backgroundColor: selected ? `${color}22` : "#111118",
              border: selected ? `2px solid ${color}` : "2px solid transparent",
            }}
          >
            <span
              style={{
                fontSize: selected ? "32px" : "24px",
                transition: "font-size 200ms",
                lineHeight: 1,
              }}
            >
              {emoji}
            </span>
            <span className="text-xs" style={{ color: selected ? color : "#ffffff40" }}>
              {MOOD_LABELS[i]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

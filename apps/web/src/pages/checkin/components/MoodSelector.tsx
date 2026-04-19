import { cn } from "@dopamind/ui";

const MOODS = [
  { emoji: "😞", label: "Péssimo", gradient: "from-rose-500 to-fuchsia-500" },
  { emoji: "😟", label: "Ruim", gradient: "from-orange-400 to-rose-400" },
  { emoji: "😐", label: "Ok", gradient: "from-amber-400 to-orange-400" },
  { emoji: "🙂", label: "Bem", gradient: "from-violet-400 to-indigo-400" },
  { emoji: "😊", label: "Ótimo", gradient: "from-emerald-400 to-teal-400" },
];

interface MoodSelectorProps {
  value: number;
  onChange: (v: number) => void;
  phase: number;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex items-end justify-between gap-1.5">
      {MOODS.map((mood, i) => {
        const score = i + 1;
        const selected = value === score;
        return (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={cn(
              "flex flex-1 flex-col items-center gap-2 rounded-2xl py-3 transition-all duration-200 active:scale-95",
              selected
                ? "bg-white/[0.06] border border-white/15 shadow-[0_6px_24px_-8px_rgba(147,51,234,0.4)]"
                : "border border-transparent",
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                selected
                  ? `h-14 w-14 bg-gradient-to-br ${mood.gradient} shadow-[0_8px_24px_-6px_rgba(167,139,250,0.6)]`
                  : "h-11 w-11 bg-white/5",
              )}
            >
              <span
                className="leading-none transition-all"
                style={{ fontSize: selected ? 30 : 22 }}
              >
                {mood.emoji}
              </span>
            </span>
            <span
              className={cn(
                "text-[11px] font-medium transition-colors",
                selected ? "text-white" : "text-white/35",
              )}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

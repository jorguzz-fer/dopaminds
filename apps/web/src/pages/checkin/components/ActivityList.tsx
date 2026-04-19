import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@dopamind/ui";

const PRESET_ACTIVITIES = [
  "Exercício físico",
  "Meditação",
  "Leitura",
  "Caminhada",
  "Conversa com amigo",
  "Banho frio",
  "Sono regular",
  "Tempo na natureza",
];

interface ActivityListProps {
  value: string[];
  onChange: (v: string[]) => void;
  phase: number;
}

export function ActivityList({ value, onChange }: ActivityListProps) {
  const [customInput, setCustomInput] = useState("");

  const toggle = (activity: string) => {
    onChange(
      value.includes(activity) ? value.filter((v) => v !== activity) : [...value, activity],
    );
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustomInput("");
  };

  return (
    <div className="space-y-2">
      {PRESET_ACTIVITIES.map((activity) => {
        const selected = value.includes(activity);
        return (
          <button
            key={activity}
            type="button"
            onClick={() => toggle(activity)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-150",
              selected
                ? "bg-white/[0.07] border border-violet-400/30 text-white shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12)]"
                : "bg-white/[0.03] border border-white/10 text-white/60",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-colors",
                selected ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_2px_8px_-2px_rgba(167,139,250,0.5)]" : "bg-white/10",
              )}
            >
              {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </span>
            <span className="flex-1 text-left">{activity}</span>
          </button>
        );
      })}

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Outra atividade..."
          className="flex-1 rounded-full bg-white/[0.04] border border-white/10 px-5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400/40 focus:bg-white/[0.06]"
        />
        <button
          type="button"
          onClick={addCustom}
          aria-label="Adicionar"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 text-violet-200 border border-violet-400/30 transition-all active:scale-95 hover:bg-violet-500/25"
        >
          <Plus className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

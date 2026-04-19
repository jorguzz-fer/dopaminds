import { useState } from "react";
import { getPhaseColor } from "../../../lib/phaseColors";

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

export function ActivityList({ value, onChange, phase }: ActivityListProps) {
  const color = getPhaseColor(phase);
  const [customInput, setCustomInput] = useState("");

  const toggle = (activity: string) => {
    onChange(value.includes(activity) ? value.filter((v) => v !== activity) : [...value, activity]);
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
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm transition-all duration-150"
            style={{
              backgroundColor: selected ? `${color}22` : "#111118",
              color: selected ? "white" : "#ffffff60",
            }}
          >
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: selected ? color : "#ffffff15" }}
            >
              {selected && <span className="text-white text-xs">✓</span>}
            </span>
            {activity}
          </button>
        );
      })}
      {/* Custom activity input */}
      <div className="flex gap-2 mt-1">
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
          className="flex-1 bg-[#111118] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ backgroundColor: `${color}22`, color }}
        >
          +
        </button>
      </div>
    </div>
  );
}

import { getPhaseColor } from "../../../lib/phaseColors";

const TRIGGERS = [
  { key: "boredom", label: "Tédio" },
  { key: "stress", label: "Estresse" },
  { key: "loneliness", label: "Solidão" },
  { key: "social", label: "Situação social" },
  { key: "nighttime", label: "Noturno" },
  { key: "morning", label: "Manhã" },
  { key: "weekend", label: "Fim de semana" },
  { key: "work", label: "Trabalho" },
  { key: "anxiety", label: "Ansiedade" },
  { key: "sadness", label: "Tristeza" },
];

interface TriggerGridProps {
  value: string[];
  onChange: (v: string[]) => void;
  phase: number;
}

export function TriggerGrid({ value, onChange, phase }: TriggerGridProps) {
  const color = getPhaseColor(phase);

  const toggle = (key: string) => {
    onChange(value.includes(key) ? value.filter((v) => v !== key) : [...value, key]);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {TRIGGERS.map((t) => {
        const selected = value.includes(t.key);
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => toggle(t.key)}
            className="py-2.5 px-3 rounded-xl text-sm font-medium text-left transition-all duration-150"
            style={{
              backgroundColor: selected ? `${color}33` : "#111118",
              color: selected ? color : "#ffffff60",
              border: `1px solid ${selected ? color + "66" : "#ffffff10"}`,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

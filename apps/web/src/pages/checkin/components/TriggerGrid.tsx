import { cn } from "@dopamind/ui";

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

export function TriggerGrid({ value, onChange }: TriggerGridProps) {
  const toggle = (key: string) => {
    onChange(value.includes(key) ? value.filter((v) => v !== key) : [...value, key]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TRIGGERS.map((t) => {
        const selected = value.includes(t.key);
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => toggle(t.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.97]",
              selected
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border border-violet-300/40 shadow-[0_4px_16px_-4px_rgba(167,139,250,0.55)]"
                : "bg-white/[0.05] text-white/65 border border-white/10 hover:bg-white/[0.08]",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

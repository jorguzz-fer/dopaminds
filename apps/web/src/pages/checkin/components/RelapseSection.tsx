import { Card } from "@dopamind/ui";
import { Lightbulb } from "lucide-react";

interface RelapseSectionProps {
  value: boolean;
  onChange: (v: boolean) => void;
  relapseDuration: number | null;
  onRelapseDurationChange: (v: number | null) => void;
}

export function RelapseSection({
  value,
  onChange,
  relapseDuration,
  onRelapseDurationChange,
}: RelapseSectionProps) {
  return (
    <Card variant="frosted" padding="md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Tive uma recaída hoje</p>
          <p className="mt-0.5 text-xs text-white/45">Honestidade acelera sua recuperação</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(!value)}
          aria-pressed={value}
          className="relative h-8 w-14 flex-shrink-0 rounded-full transition-colors duration-200"
          style={{
            background: value
              ? "linear-gradient(90deg, #f43f5e, #c026d3)"
              : "rgba(255,255,255,0.12)",
            boxShadow: value ? "0 4px 14px -4px rgba(244,63,94,0.55)" : "none",
          }}
        >
          <span
            className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200"
            style={{ transform: value ? "translateX(26px)" : "translateX(4px)" }}
          />
        </button>
      </div>

      {value && (
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4 animate-[fadeInUp_0.3s_ease-out_both]">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/45 font-semibold">
              Duração (minutos)
            </label>
            <input
              type="number"
              value={relapseDuration ?? ""}
              onChange={(e) =>
                onRelapseDurationChange(e.target.value ? Number(e.target.value) : null)
              }
              min={1}
              placeholder="Ex: 30"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-violet-400/40 focus:bg-white/[0.06] focus:outline-none"
            />
          </div>
          <div className="flex gap-3 rounded-2xl bg-violet-500/10 border border-violet-400/20 px-4 py-3">
            <Lightbulb className="h-4 w-4 flex-shrink-0 text-violet-300 mt-0.5" strokeWidth={2} />
            <p className="text-xs leading-relaxed text-white/70">
              Recaída não é fracasso — é dado. Seu streak vai reiniciar, mas o progresso
              neurológico permanece. O cérebro continua se recalibrando.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

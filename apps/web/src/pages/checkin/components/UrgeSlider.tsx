interface UrgeSliderProps {
  value: number;
  onChange: (v: number) => void;
  phase: number;
}

function urgeLabel(value: number): string {
  if (value <= 2) return "Tranquilo";
  if (value <= 4) return "Leve";
  if (value <= 6) return "Moderada";
  if (value <= 8) return "Forte";
  return "Extrema";
}

export function UrgeSlider({ value, onChange }: UrgeSliderProps) {
  const pct = ((value - 1) / 9) * 100;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[11px] uppercase tracking-[0.22em] text-white/45 font-semibold">
          Nível de urgência
        </h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
            {value}
          </span>
          <span className="text-xs text-white/50">{urgeLabel(value)}</span>
        </div>
      </div>

      <div className="relative py-2">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(90deg, #6be3b1 0%, #8b9ff7 40%, #c084fc 70%, #ff6b7a 100%)`,
            clipPath: `inset(0 ${100 - pct}% 0 0 round 999px)`,
            WebkitClipPath: `inset(0 ${100 - pct}% 0 0 round 999px)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-2 -translate-y-1/2 rounded-full bg-white/8"
        />
      </div>

      <div className="mt-2 flex justify-between">
        <span className="text-[11px] text-white/35">Sem urgência</span>
        <span className="text-[11px] text-white/35">Urgência extrema</span>
      </div>
    </div>
  );
}

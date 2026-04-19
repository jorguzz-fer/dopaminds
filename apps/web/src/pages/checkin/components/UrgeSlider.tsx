import { getPhaseColor } from "../../../lib/phaseColors";

interface UrgeSliderProps {
  value: number;
  onChange: (v: number) => void;
  phase: number;
}

export function UrgeSlider({ value, onChange, phase }: UrgeSliderProps) {
  const color = getPhaseColor(phase);
  const pct = ((value - 1) / 9) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white/60 text-xs uppercase tracking-wider">Nível de urgência</h2>
        <span className="text-2xl font-bold" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} ${pct}%, #ffffff18 ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-white/30 text-xs">Sem urgência</span>
        <span className="text-white/30 text-xs">Urgência extrema</span>
      </div>
    </div>
  );
}

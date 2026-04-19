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
    <div className="bg-[#111118] rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium">Tive uma recaída hoje</p>
          <p className="text-white/40 text-xs mt-0.5">Honestidade acelera sua recuperação</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="relative w-14 h-7 rounded-full transition-colors duration-200 flex-shrink-0"
          style={{ backgroundColor: value ? "#FF4444" : "#ffffff22" }}
        >
          <span
            className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: value ? "translateX(28px)" : "translateX(2px)" }}
          />
        </button>
      </div>

      {value && (
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider">
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
              className="mt-2 w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20"
            />
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            💡 Recaída não é fracasso — é dado. Seu streak vai reiniciar, mas o progresso
            neurológico permanece. O cérebro continua se recalibrando.
          </p>
        </div>
      )}
    </div>
  );
}

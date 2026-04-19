import { useState } from "react";
import { Button } from "@dopamind/ui";
import { Minus, Plus, ArrowRight } from "lucide-react";

interface Step2Props {
  onNext: (data: { hoursPerDay: number }) => void;
}

function getUsageLabel(hours: number): string {
  if (hours < 2) return "Uso leve";
  if (hours < 6) return "Uso moderado";
  return "Uso intenso";
}

function StepperButton({
  onClick,
  disabled,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all duration-150 active:scale-95 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function Step2Usage({ onNext }: Step2Props) {
  const [value, setValue] = useState(2.0);

  const decrement = () => setValue((v) => Math.max(0.5, Math.round((v - 0.5) * 10) / 10));
  const increment = () => setValue((v) => Math.min(16, Math.round((v + 0.5) * 10) / 10));

  return (
    <div className="flex min-h-full flex-col gap-6 px-5 pt-6 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold text-white leading-tight tracking-tight">
          Quanto tempo você usa por dia?
        </h1>
        <p className="text-sm text-white/50">Seja honesto — isso calibra o algoritmo</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <span className="text-7xl font-semibold leading-none tabular-nums bg-gradient-to-b from-white to-violet-200 bg-clip-text text-transparent">
          {value}h
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">
          {getUsageLabel(value)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-10">
        <StepperButton onClick={decrement} disabled={value <= 0.5} ariaLabel="Diminuir">
          <Minus className="h-5 w-5" strokeWidth={2.25} />
        </StepperButton>
        <StepperButton onClick={increment} disabled={value >= 16} ariaLabel="Aumentar">
          <Plus className="h-5 w-5" strokeWidth={2.25} />
        </StepperButton>
      </div>

      <div className="mt-auto pt-6">
        <Button size="lg" fullWidth onClick={() => onNext({ hoursPerDay: value })}>
          Continuar
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}

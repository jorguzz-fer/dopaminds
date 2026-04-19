import { useState } from "react";
import { Button, Card } from "@dopamind/ui";
import { calculateSeverityScore } from "@dopamind/science";
import { Minus, Plus, Lock, Sparkles } from "lucide-react";
import type { OnboardingFormData } from "../OnboardingPage";

interface Step5Props {
  onNext: (data: { dailyUsageGoalHours: number }) => void;
  formData: OnboardingFormData;
  isSubmitting: boolean;
}

function getSeverityColor(score: number): string {
  if (score <= 3) return "#6be3b1";
  if (score <= 6) return "#ffb347";
  return "#ff6b7a";
}

function getSeverityLabel(score: number): string {
  if (score <= 3) return "Leve";
  if (score <= 6) return "Moderado";
  return "Intenso";
}

export function Step5Goal({ onNext, formData, isSubmitting }: Step5Props) {
  const maxGoal = Math.max(0, formData.hoursPerDay - 0.5);
  const startValue = Math.max(0.5, formData.hoursPerDay - 1);
  const [value, setValue] = useState(Math.min(startValue, maxGoal));

  const severityScore = calculateSeverityScore({
    hoursPerDay: formData.hoursPerDay,
    failedAttempts: formData.failedAttempts,
    negativeConsequences: formData.negativeConsequences,
    withdrawalSymptoms: formData.withdrawalSymptoms,
    interferesWithLife: formData.interferesWithLife,
  });

  const severityColor = getSeverityColor(severityScore);
  const severityLabel = getSeverityLabel(severityScore);

  return (
    <div className="flex min-h-full flex-col gap-6 px-5 pt-6 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold text-white leading-tight tracking-tight">
          Qual é sua meta?
        </h1>
        <p className="text-sm text-white/50">Defina um alvo realista para o primeiro mês</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 py-6">
        {value === 0 ? (
          <div className="flex items-center gap-3 text-white">
            <Lock className="h-7 w-7 text-violet-300" strokeWidth={1.75} />
            <span className="text-4xl font-semibold bg-gradient-to-b from-white to-violet-200 bg-clip-text text-transparent">
              Abstinência total
            </span>
          </div>
        ) : (
          <span className="text-7xl font-semibold leading-none tabular-nums bg-gradient-to-b from-white to-violet-200 bg-clip-text text-transparent">
            {value}h
          </span>
        )}
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">por dia</span>
      </div>

      <div className="flex items-center justify-center gap-10">
        <button
          onClick={() => setValue((v) => Math.max(0, Math.round((v - 0.5) * 10) / 10))}
          disabled={value <= 0}
          aria-label="Diminuir"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all active:scale-95 disabled:opacity-30"
        >
          <Minus className="h-5 w-5" strokeWidth={2.25} />
        </button>
        <button
          onClick={() => setValue((v) => Math.min(maxGoal, Math.round((v + 0.5) * 10) / 10))}
          disabled={value >= maxGoal}
          aria-label="Aumentar"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all active:scale-95 disabled:opacity-30"
        >
          <Plus className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>

      <Card variant="frosted" padding="md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-medium text-white/70">
            Nível de dependência estimado
          </span>
          <span className="text-sm font-bold" style={{ color: severityColor }}>
            {severityScore}/10 · {severityLabel}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(severityScore / 10) * 100}%`,
              background: `linear-gradient(90deg, ${severityColor}88, ${severityColor})`,
              boxShadow: `0 0 16px ${severityColor}66`,
            }}
          />
        </div>

        <p className="mt-3 text-[11px] text-white/40">
          Baseado em critérios científicos de dependência comportamental
        </p>
      </Card>

      <div className="mt-auto pt-2">
        <Button
          size="lg"
          fullWidth
          loading={isSubmitting}
          onClick={() => onNext({ dailyUsageGoalHours: value })}
        >
          <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          Começar minha recuperação
        </Button>
      </div>
    </div>
  );
}

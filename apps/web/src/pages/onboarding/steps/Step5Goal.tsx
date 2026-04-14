import { useState } from "react";
import { Button } from "@dopamind/ui";
import { calculateSeverityScore } from "@dopamind/science";
import type { OnboardingFormData } from "../OnboardingPage";

interface Step5Props {
  onNext: (data: { dailyUsageGoalHours: number }) => void;
  onBack: () => void;
  formData: OnboardingFormData;
  isSubmitting: boolean;
}

function getSeverityColor(score: number): string {
  if (score <= 3) return "#44CC88";
  if (score <= 6) return "#FFAA00";
  return "#FF4444";
}

export function Step5Goal({ onNext, formData, isSubmitting }: Step5Props) {
  const maxGoal = Math.max(0, formData.hoursPerDay - 0.5);
  const startValue = Math.max(0.5, formData.hoursPerDay - 1);
  const [value, setValue] = useState(Math.min(startValue, maxGoal));

  function decrement() {
    setValue((v) => Math.max(0, Math.round((v - 0.5) * 10) / 10));
  }

  function increment() {
    setValue((v) => Math.min(maxGoal, Math.round((v + 0.5) * 10) / 10));
  }

  const severityScore = calculateSeverityScore({
    hoursPerDay: formData.hoursPerDay,
    failedAttempts: formData.failedAttempts,
    negativeConsequences: formData.negativeConsequences,
    withdrawalSymptoms: formData.withdrawalSymptoms,
    interferesWithLife: formData.interferesWithLife,
  });

  const severityColor = getSeverityColor(severityScore);

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-white leading-tight">
          Qual é sua meta?
        </h1>
        <p className="text-[14px]" style={{ color: "#6B6B80" }}>
          Defina um alvo realista para o primeiro mês
        </p>
      </div>

      {/* Stepper */}
      <div className="flex flex-col items-center gap-3 py-6">
        <span
          className="text-[48px] font-bold leading-none"
          style={{ color: "#FF4444" }}
        >
          {value === 0 ? "Abstinência total 🔒" : `${value}h por dia`}
        </span>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button
          onClick={decrement}
          disabled={value <= 0}
          className="flex items-center justify-center text-[24px] font-bold text-white rounded-full transition-all duration-150 active:scale-95 disabled:opacity-40"
          style={{
            width: 56,
            height: 56,
            backgroundColor: "#22222E",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          −
        </button>
        <button
          onClick={increment}
          disabled={value >= maxGoal}
          className="flex items-center justify-center text-[24px] font-bold text-white rounded-full transition-all duration-150 active:scale-95 disabled:opacity-40"
          style={{
            width: 56,
            height: 56,
            backgroundColor: "#22222E",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          +
        </button>
      </div>

      {/* Severity preview */}
      <div
        className="flex flex-col gap-3 rounded-2xl p-4"
        style={{ backgroundColor: "#1A1A24" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-white">
            Nível de dependência estimado:
          </span>
          <span className="text-[14px] font-bold" style={{ color: severityColor }}>
            {severityScore}/10
          </span>
        </div>

        {/* Bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(severityScore / 10) * 100}%`,
              backgroundColor: severityColor,
            }}
          />
        </div>

        <p className="text-[12px]" style={{ color: "#6B6B80" }}>
          Baseado em critérios científicos de dependência comportamental
        </p>
      </div>

      <div className="mt-auto pt-2">
        <Button
          size="lg"
          accentColor="#FF4444"
          className="w-full"
          loading={isSubmitting}
          onClick={() => onNext({ dailyUsageGoalHours: value })}
        >
          Começar minha recuperação 🧠
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import type { AddictionCategory } from "@dopamind/shared";
import { ProgressBar } from "@dopamind/ui";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { useAppStore } from "../../store/useAppStore";
import { Step1Category } from "./steps/Step1Category";
import { Step2Usage } from "./steps/Step2Usage";
import { Step3History } from "./steps/Step3History";
import { Step4Impact } from "./steps/Step4Impact";
import { Step5Goal } from "./steps/Step5Goal";

export interface OnboardingFormData {
  category: AddictionCategory | null;
  hoursPerDay: number;
  failedAttempts: number;
  negativeConsequences: boolean;
  withdrawalSymptoms: boolean;
  interferesWithLife: boolean;
  dailyUsageGoalHours: number;
}

const INITIAL_FORM: OnboardingFormData = {
  category: null,
  hoursPerDay: 2,
  failedAttempts: 0,
  negativeConsequences: false,
  withdrawalSymptoms: false,
  interferesWithLife: false,
  dailyUsageGoalHours: 1,
};

const TOTAL_STEPS = 5;

export function OnboardingPage() {
  const navigate = useNavigate();
  const store = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNext(partial: Partial<OnboardingFormData>) {
    if (animating) return;
    setFormData((prev) => ({ ...prev, ...partial }));
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setAnimating(false);
    }, 260);
  }

  function handleBack() {
    if (animating || currentStep === 1) return;
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setAnimating(false);
    }, 260);
  }

  async function handleSubmit(partial: Partial<OnboardingFormData>) {
    if (animating || isSubmitting) return;
    const finalData = { ...formData, ...partial };
    setFormData(finalData);
    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({
          ...finalData,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      await store.refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  const animationClass = animating
    ? ""
    : direction === "forward"
      ? "animate-[slideInFromRight_0.3s_cubic-bezier(0.22,1,0.36,1)_both]"
      : "animate-[slideInFromLeft_0.3s_cubic-bezier(0.22,1,0.36,1)_both]";

  function renderStep() {
    switch (currentStep) {
      case 1:
        return <Step1Category onNext={handleNext} />;
      case 2:
        return <Step2Usage onNext={handleNext} />;
      case 3:
        return <Step3History onNext={handleNext} />;
      case 4:
        return <Step4Impact onNext={handleNext} />;
      case 5:
        return <Step5Goal onNext={handleSubmit} formData={formData} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="flex items-center gap-4 px-5 pt-4 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
      >
        <button
          onClick={handleBack}
          aria-label="Voltar"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all duration-150 active:scale-95 disabled:opacity-0"
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <div className="flex-1">
          <ProgressBar value={0} segments={TOTAL_STEPS} activeSegment={currentStep} />
        </div>

        <div className="w-10 flex-shrink-0 text-right text-[11px] font-semibold uppercase tracking-widest text-white/40">
          {currentStep}/{TOTAL_STEPS}
        </div>
      </header>

      {error && (
        <div className="mx-5 mb-2 rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-[14px] text-rose-100">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div key={currentStep} className={`h-full overflow-y-auto ${animationClass}`}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

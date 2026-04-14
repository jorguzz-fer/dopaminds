import { useState } from "react";
import { useNavigate } from "react-router";
import type { AddictionCategory } from "@dopamind/shared";
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
    }, 300);
  }

  function handleBack() {
    if (animating || currentStep === 1) return;
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setAnimating(false);
    }, 300);
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

  const animationStyle: React.CSSProperties = animating
    ? {}
    : {
        animation: `${direction === "forward" ? "slideInFromRight" : "slideInFromLeft"} 0.25s ease-out`,
      };

  function renderStep() {
    switch (currentStep) {
      case 1:
        return <Step1Category onNext={(data) => handleNext(data)} />;
      case 2:
        return (
          <Step2Usage
            onNext={(data) => handleNext(data)}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3History
            onNext={(data) => handleNext(data)}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4Impact
            onNext={(data) => handleNext(data)}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <Step5Goal
            onNext={(data) => handleSubmit(data)}
            onBack={handleBack}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#111118" }}
    >
      {/* Fixed header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)",
        }}
      >
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150 active:scale-95"
          style={{
            backgroundColor: currentStep === 1 ? "transparent" : "#1A1A24",
            opacity: currentStep === 1 ? 0 : 1,
            pointerEvents: currentStep === 1 ? "none" : "auto",
          }}
          aria-hidden={currentStep === 1}
        >
          <span className="text-white text-[20px] leading-none">←</span>
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            return (
              <div
                key={stepNumber}
                className="rounded-full transition-all duration-300"
                style={{
                  width: isCurrent ? 20 : 8,
                  height: 8,
                  backgroundColor:
                    isCompleted || isCurrent
                      ? "#FF4444"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            );
          })}
        </div>

        {/* Spacer to balance the back button */}
        <div className="w-10" />
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mx-5 mb-2 rounded-xl px-4 py-3 text-[14px] text-white"
          style={{ backgroundColor: "rgba(255,68,68,0.15)", border: "1px solid rgba(255,68,68,0.3)" }}
        >
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 overflow-hidden">
        <div
          key={currentStep}
          style={animationStyle}
          className="h-full overflow-y-auto"
        >
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

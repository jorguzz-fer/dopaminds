import { useState } from "react";
import { Button } from "@dopamind/ui";

interface Step3Props {
  onNext: (data: { failedAttempts: number; withdrawalSymptoms: boolean }) => void;
  onBack: () => void;
}

function getAttemptsLabel(n: number): string {
  if (n === 0) return "Nenhuma";
  if (n === 1) return "1 vez";
  if (n >= 10) return "10+ vezes";
  return `${n} vezes`;
}

export function Step3History({ onNext }: Step3Props) {
  const [attempts, setAttempts] = useState(0);
  const [withdrawal, setWithdrawal] = useState(false);

  function decrementAttempts() {
    setAttempts((v) => Math.max(0, v - 1));
  }

  function incrementAttempts() {
    setAttempts((v) => Math.min(20, v + 1));
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-white leading-tight">
          Tentativas anteriores
        </h1>
      </div>

      {/* Section 1: Failed attempts */}
      <div
        className="flex flex-col gap-4 rounded-2xl p-4"
        style={{ backgroundColor: "#1A1A24" }}
      >
        <p className="text-[15px] font-semibold text-white">
          Quantas vezes você tentou parar?
        </p>

        <div className="flex items-center gap-6">
          <button
            onClick={decrementAttempts}
            disabled={attempts <= 0}
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

          <span
            className="text-[40px] font-bold leading-none flex-1 text-center"
            style={{ color: "#FF4444" }}
          >
            {getAttemptsLabel(attempts)}
          </span>

          <button
            onClick={incrementAttempts}
            disabled={attempts >= 20}
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
      </div>

      {/* Section 2: Withdrawal symptoms */}
      <div
        className="flex flex-col gap-4 rounded-2xl p-4"
        style={{ backgroundColor: "#1A1A24" }}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-[15px] font-semibold text-white">
            Você sente abstinência ao tentar parar?
          </p>
          <p className="text-[13px]" style={{ color: "#6B6B80" }}>
            Ansiedade, irritação, inquietação
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setWithdrawal(true)}
            className="flex-1 h-12 rounded-2xl font-semibold text-[15px] transition-all duration-150 active:scale-[0.98]"
            style={{
              backgroundColor: withdrawal ? "#FF4444" : "#22222E",
              color: withdrawal ? "#fff" : "#6B6B80",
              border: withdrawal
                ? "1px solid #FF4444"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Sim
          </button>
          <button
            onClick={() => setWithdrawal(false)}
            className="flex-1 h-12 rounded-2xl font-semibold text-[15px] transition-all duration-150 active:scale-[0.98]"
            style={{
              backgroundColor: !withdrawal ? "#FF4444" : "#22222E",
              color: !withdrawal ? "#fff" : "#6B6B80",
              border: !withdrawal
                ? "1px solid #FF4444"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Não
          </button>
        </div>
      </div>

      <div className="mt-auto pt-2">
        <Button
          size="lg"
          accentColor="#FF4444"
          className="w-full"
          onClick={() => onNext({ failedAttempts: attempts, withdrawalSymptoms: withdrawal })}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}

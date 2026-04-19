import { useState } from "react";
import { Button } from "@dopamind/ui";

interface Step2Props {
  onNext: (data: { hoursPerDay: number }) => void;
  onBack: () => void;
}

function getUsageLabel(hours: number): string {
  if (hours < 2) return "Uso leve";
  if (hours < 6) return "Uso moderado";
  return "Uso intenso";
}

export function Step2Usage({ onNext }: Step2Props) {
  const [value, setValue] = useState(2.0);

  function decrement() {
    setValue((v) => Math.max(0.5, Math.round((v - 0.5) * 10) / 10));
  }

  function increment() {
    setValue((v) => Math.min(16, Math.round((v + 0.5) * 10) / 10));
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-white leading-tight">
          Quanto tempo você usa por dia?
        </h1>
        <p className="text-[14px]" style={{ color: "#6B6B80" }}>
          Seja honesto — isso ajuda o algoritmo
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 py-8">
        <span
          className="text-[56px] font-bold leading-none"
          style={{ color: "#FF4444" }}
        >
          {value % 1 === 0 ? `${value}h` : `${value}h`}
        </span>
        <span className="text-[15px] font-medium" style={{ color: "#6B6B80" }}>
          {getUsageLabel(value)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button
          onClick={decrement}
          disabled={value <= 0.5}
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
          disabled={value >= 16}
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

      <div className="mt-auto pt-6">
        <Button
          size="lg"
          accentColor="#FF4444"
          className="w-full"
          onClick={() => onNext({ hoursPerDay: value })}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}

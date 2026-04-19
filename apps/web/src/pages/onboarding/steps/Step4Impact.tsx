import { useState } from "react";
import { Button } from "@dopamind/ui";

interface Step4Props {
  onNext: (data: { negativeConsequences: boolean; interferesWithLife: boolean }) => void;
  onBack: () => void;
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-14 h-7 rounded-full transition-colors duration-200 flex-shrink-0"
      style={{ backgroundColor: value ? "#FF4444" : "#ffffff22" }}
    >
      <span
        className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: value ? "translateX(28px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export function Step4Impact({ onNext }: Step4Props) {
  const [negativeConsequences, setNegativeConsequences] = useState(false);
  const [interferesWithLife, setInterferesWithLife] = useState(false);

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-white leading-tight">
          Impacto na sua vida
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {/* Row 1 */}
        <div
          className="flex items-center gap-4 rounded-2xl p-4"
          style={{ backgroundColor: "#1A1A24" }}
        >
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-white">
              Causou problemas reais?
            </p>
            <p className="text-[13px]" style={{ color: "#6B6B80" }}>
              Conflitos, gastos, perda de produtividade
            </p>
          </div>
          <Toggle value={negativeConsequences} onChange={setNegativeConsequences} />
        </div>

        {/* Row 2 */}
        <div
          className="flex items-center gap-4 rounded-2xl p-4"
          style={{ backgroundColor: "#1A1A24" }}
        >
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-white">
              Interfere com coisas importantes?
            </p>
            <p className="text-[13px]" style={{ color: "#6B6B80" }}>
              Trabalho, escola, relacionamentos, sono
            </p>
          </div>
          <Toggle value={interferesWithLife} onChange={setInterferesWithLife} />
        </div>
      </div>

      <div className="mt-auto pt-2">
        <Button
          size="lg"
          accentColor="#FF4444"
          className="w-full"
          onClick={() =>
            onNext({ negativeConsequences, interferesWithLife })
          }
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}

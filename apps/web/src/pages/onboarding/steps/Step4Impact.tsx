import { useState } from "react";
import { Button, Card } from "@dopamind/ui";
import { ArrowRight } from "lucide-react";

interface Step4Props {
  onNext: (data: { negativeConsequences: boolean; interferesWithLife: boolean }) => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className="relative h-8 w-14 flex-shrink-0 rounded-full transition-colors duration-200"
      style={{
        background: value
          ? "linear-gradient(90deg, #7c3aed, #c026d3)"
          : "rgba(255,255,255,0.12)",
        boxShadow: value ? "0 0 0 1px rgba(167,139,250,0.4), 0 4px 14px -4px rgba(147,51,234,0.55)" : "none",
      }}
    >
      <span
        className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: value ? "translateX(26px)" : "translateX(4px)" }}
      />
    </button>
  );
}

function ImpactRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Card variant="frosted" padding="md">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-[15px] font-semibold text-white">{title}</p>
          <p className="text-[13px] text-white/50 leading-snug">{description}</p>
        </div>
        <Toggle value={value} onChange={onChange} />
      </div>
    </Card>
  );
}

export function Step4Impact({ onNext }: Step4Props) {
  const [negativeConsequences, setNegativeConsequences] = useState(false);
  const [interferesWithLife, setInterferesWithLife] = useState(false);

  return (
    <div className="flex min-h-full flex-col gap-5 px-5 pt-6 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold text-white leading-tight tracking-tight">
          Impacto na sua vida
        </h1>
        <p className="text-sm text-white/50">Seja honesto — fica só entre você e o DopaMind</p>
      </div>

      <div className="flex flex-col gap-3">
        <ImpactRow
          title="Causou problemas reais?"
          description="Conflitos, gastos, perda de produtividade"
          value={negativeConsequences}
          onChange={setNegativeConsequences}
        />
        <ImpactRow
          title="Interfere com coisas importantes?"
          description="Trabalho, escola, relacionamentos, sono"
          value={interferesWithLife}
          onChange={setInterferesWithLife}
        />
      </div>

      <div className="mt-auto pt-4">
        <Button
          size="lg"
          fullWidth
          onClick={() => onNext({ negativeConsequences, interferesWithLife })}
        >
          Continuar
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}

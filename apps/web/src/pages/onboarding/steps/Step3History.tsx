import { useState } from "react";
import { Button, Card, cn } from "@dopamind/ui";
import { Minus, Plus, ArrowRight } from "lucide-react";

interface Step3Props {
  onNext: (data: { failedAttempts: number; withdrawalSymptoms: boolean }) => void;
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

  return (
    <div className="flex min-h-full flex-col gap-5 px-5 pt-6 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold text-white leading-tight tracking-tight">
          Tentativas anteriores
        </h1>
        <p className="text-sm text-white/50">Entender seu histórico define a trilha</p>
      </div>

      <Card variant="frosted" padding="md">
        <p className="text-[15px] font-semibold text-white mb-4">
          Quantas vezes você tentou parar?
        </p>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setAttempts((v) => Math.max(0, v - 1))}
            disabled={attempts <= 0}
            aria-label="Diminuir"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all active:scale-95 disabled:opacity-30"
          >
            <Minus className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <span className="flex-1 text-center text-[34px] font-semibold leading-none bg-gradient-to-b from-white to-violet-200 bg-clip-text text-transparent">
            {getAttemptsLabel(attempts)}
          </span>

          <button
            onClick={() => setAttempts((v) => Math.min(20, v + 1))}
            disabled={attempts >= 20}
            aria-label="Aumentar"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 transition-all active:scale-95 disabled:opacity-30"
          >
            <Plus className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </Card>

      <Card variant="frosted" padding="md">
        <div className="mb-4 space-y-0.5">
          <p className="text-[15px] font-semibold text-white">
            Você sente abstinência ao tentar parar?
          </p>
          <p className="text-[13px] text-white/50">Ansiedade, irritação, inquietação</p>
        </div>

        <div className="flex gap-3">
          <BinaryButton label="Sim" active={withdrawal} onClick={() => setWithdrawal(true)} />
          <BinaryButton label="Não" active={!withdrawal} onClick={() => setWithdrawal(false)} />
        </div>
      </Card>

      <div className="mt-auto pt-4">
        <Button
          size="lg"
          fullWidth
          onClick={() => onNext({ failedAttempts: attempts, withdrawalSymptoms: withdrawal })}
        >
          Continuar
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}

function BinaryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-12 flex-1 rounded-full text-[15px] font-semibold transition-all duration-150 active:scale-[0.98]",
        active
          ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_6px_20px_-6px_rgba(147,51,234,0.55)]"
          : "bg-white/5 text-white/55 border border-white/10",
      )}
    >
      {label}
    </button>
  );
}

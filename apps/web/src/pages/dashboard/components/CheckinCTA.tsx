import { Button, Card } from "@dopamind/ui";
import { useNavigate } from "react-router";
import { Check, Sparkles } from "lucide-react";

interface CheckinCTAProps {
  hasCheckedInToday: boolean;
  phase: number;
  loading: boolean;
}

export function CheckinCTA({ hasCheckedInToday, loading }: CheckinCTAProps) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="h-14 rounded-3xl bg-white/5 animate-pulse" />;
  }

  if (hasCheckedInToday) {
    return (
      <Card variant="frosted" padding="md">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
            <Check className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Check-in feito hoje</p>
            <p className="text-xs text-white/45">Volte amanhã para manter seu streak</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Button size="lg" fullWidth onClick={() => navigate("/checkin")}>
      <Sparkles className="h-4 w-4" strokeWidth={2.25} />
      Fazer check-in de hoje
    </Button>
  );
}

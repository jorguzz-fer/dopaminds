import { Button } from "@dopamind/ui";
import { useNavigate } from "react-router";
import { getPhaseColor } from "../../../lib/phaseColors";

interface CheckinCTAProps {
  hasCheckedInToday: boolean;
  phase: number;
  loading: boolean;
}

export function CheckinCTA({ hasCheckedInToday, phase, loading }: CheckinCTAProps) {
  const navigate = useNavigate();

  if (loading) return <div className="h-14 bg-white/5 rounded-2xl animate-pulse" />;

  if (hasCheckedInToday) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#111118] rounded-2xl">
        <span className="text-green-400 text-xl">✓</span>
        <div>
          <p className="text-white/80 text-sm font-medium">Check-in feito hoje</p>
          <p className="text-white/40 text-xs mt-0.5">Volte amanhã para manter seu streak</p>
        </div>
      </div>
    );
  }

  return (
    <Button
      size="lg"
      accentColor={getPhaseColor(phase)}
      className="w-full"
      onClick={() => navigate("/checkin")}
    >
      Fazer check-in de hoje →
    </Button>
  );
}

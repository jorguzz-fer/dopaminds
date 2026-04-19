import { cn } from "../lib/cn";

interface AmbientBackgroundProps {
  variant?: "aurora" | "mountain" | "subtle";
  className?: string;
}

export function AmbientBackground({ variant = "aurora", className }: AmbientBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(76,29,149,0.55) 0%, rgba(18,15,30,0.2) 50%, transparent 80%), radial-gradient(ellipse 60% 40% at 20% 100%, rgba(168,85,247,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 90%, rgba(217,70,239,0.12) 0%, transparent 60%), #0a0713",
        }}
      />

      {variant === "mountain" && (
        <svg
          className="absolute inset-x-0 bottom-0 w-full opacity-40"
          viewBox="0 0 390 220"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mtn-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#2a1f42" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mtn-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#120f1e" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path d="M0 140 L 60 90 L 120 130 L 190 70 L 260 120 L 330 80 L 390 110 L 390 220 L 0 220 Z" fill="url(#mtn-back)" />
          <path d="M0 170 L 80 130 L 150 165 L 230 120 L 310 160 L 390 135 L 390 220 L 0 220 Z" fill="url(#mtn-front)" />
        </svg>
      )}

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence baseFrequency='0.9' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}

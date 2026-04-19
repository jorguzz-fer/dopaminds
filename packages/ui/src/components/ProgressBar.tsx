import { cn } from "../lib/cn";

interface ProgressBarProps {
  value: number;
  color?: string;
  animated?: boolean;
  className?: string;
  segments?: number;
  activeSegment?: number;
}

export function ProgressBar({
  value,
  color = "var(--color-brand)",
  animated = false,
  className,
  segments,
  activeSegment,
}: ProgressBarProps) {
  if (segments && segments > 1) {
    return (
      <div className={cn("flex gap-1.5", className)}>
        {Array.from({ length: segments }).map((_, i) => {
          const active = activeSegment != null && i < activeSegment;
          const current = activeSegment != null && i === activeSegment - 1;
          return (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-500",
                active ? "bg-violet-400" : "bg-white/10",
                current && "shadow-[0_0_12px_rgba(167,139,250,0.8)]",
              )}
            />
          );
        })}
      </div>
    );
  }

  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <div className={cn("h-1.5 bg-white/10 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", animated && "animate-pulse")}
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

interface RingProgressProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export function RingProgress({
  value,
  size = 160,
  stroke = 12,
  color = "var(--color-brand)",
  trackColor = "rgba(255,255,255,0.08)",
  children,
}: RingProgressProps) {
  const pct = Math.min(1, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>}
    </div>
  );
}

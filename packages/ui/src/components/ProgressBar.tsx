interface ProgressBarProps {
  value: number; // 0-1
  color: string; // hex
  animated?: boolean;
  className?: string;
}

export function ProgressBar({ value, color, animated = false, className = "" }: ProgressBarProps) {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <div className={`h-1.5 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${animated ? "animate-pulse" : ""}`}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

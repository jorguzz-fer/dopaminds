import React from "react";
import { cn } from "../lib/cn";
import { phaseColor } from "../lib/phaseColors";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "frosted" | "solid" | "glow";
  accentPhase?: number;
  accentColor?: string;
  padding?: "sm" | "md" | "lg" | "none";
}

const VARIANTS: Record<NonNullable<CardProps["variant"]>, string> = {
  frosted:
    "bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]",
  solid: "bg-[var(--color-surface-2)] border border-white/5",
  glow: "bg-gradient-to-br from-violet-500/20 via-violet-500/10 to-transparent border border-violet-400/30 shadow-[0_12px_40px_-12px_rgba(147,51,234,0.45)]",
};

const PADDING: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "frosted",
  accentPhase,
  accentColor,
  padding = "md",
  className,
  style,
  children,
  ...props
}: CardProps) {
  const resolvedAccent = accentColor ?? (accentPhase != null ? phaseColor(accentPhase) : undefined);

  return (
    <div
      className={cn("relative overflow-hidden rounded-3xl", VARIANTS[variant], PADDING[padding], className)}
      style={{
        ...(resolvedAccent ? { boxShadow: `inset 0 0 0 1px ${resolvedAccent}33, 0 10px 40px -24px ${resolvedAccent}55` } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

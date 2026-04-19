import React from "react";
import { cn } from "../lib/cn";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: "default" | "violet" | "ghost";
  size?: "sm" | "md" | "lg";
}

const VARIANTS: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  default: "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10",
  violet: "bg-violet-500/15 text-violet-200 border border-violet-400/30 hover:bg-violet-500/25",
  ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
};

const SIZES: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "h-9 w-9 [&_svg]:w-4 [&_svg]:h-4",
  md: "h-11 w-11 [&_svg]:w-5 [&_svg]:h-5",
  lg: "h-14 w-14 [&_svg]:w-6 [&_svg]:h-6",
};

export function IconButton({
  icon,
  label,
  variant = "default",
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-[0.93] backdrop-blur-sm",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

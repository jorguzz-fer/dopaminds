import React from "react";
import { cn } from "../lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 text-white shadow-[0_8px_28px_-6px_rgba(147,51,234,0.55)] hover:brightness-110",
  ghost:
    "bg-white/5 text-white border border-white/10 backdrop-blur-sm hover:bg-white/10",
  outline:
    "bg-transparent text-violet-200 border border-violet-400/40 hover:bg-violet-400/10",
  destructive:
    "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-[0_8px_24px_-8px_rgba(244,63,94,0.5)]",
};

const SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base font-semibold",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight",
        "transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  accentColor?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  accentColor = "#4499FF",
  className = "",
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-[52px] px-8 text-base font-semibold",
  };

  const baseClasses =
    "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles: React.CSSProperties =
    variant === "primary"
      ? { backgroundColor: accentColor, color: "#fff" }
      : variant === "ghost"
        ? { backgroundColor: "transparent", color: accentColor, border: `1.5px solid ${accentColor}33` }
        : { backgroundColor: "#FF4444", color: "#fff" };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={{ ...variantStyles, ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          style={{ borderTopColor: "transparent" }}
        />
      ) : (
        children
      )}
    </button>
  );
}

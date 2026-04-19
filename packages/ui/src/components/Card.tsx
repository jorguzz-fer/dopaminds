import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}

export function Card({ children, className = "", accentColor }: CardProps) {
  return (
    <div
      className={`bg-[#111118] rounded-2xl p-4 ${className}`}
      style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : undefined}
    >
      {children}
    </div>
  );
}

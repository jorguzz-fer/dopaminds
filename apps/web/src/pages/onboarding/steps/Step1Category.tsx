import { useState } from "react";
import type { AddictionCategory } from "@dopamind/shared";
import { ADDICTION_CATEGORIES, ADDICTION_CATEGORY_VALUES } from "@dopamind/shared";

interface Step1Props {
  onNext: (data: { category: AddictionCategory }) => void;
}

export function Step1Category({ onNext }: Step1Props) {
  const [selected, setSelected] = useState<AddictionCategory | null>(null);

  function handleSelect(category: AddictionCategory) {
    setSelected(category);
    setTimeout(() => {
      onNext({ category });
    }, 300);
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-white leading-tight">
          O que você quer resetar?
        </h1>
        <p className="text-[14px]" style={{ color: "#6B6B80" }}>
          Escolha sua principal batalha
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ADDICTION_CATEGORY_VALUES.map((category) => {
          const { label, emoji, description } = ADDICTION_CATEGORIES[category];
          const isSelected = selected === category;

          return (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className="flex items-center gap-4 rounded-2xl px-4 text-left transition-all duration-200 active:scale-[0.98]"
              style={{
                minHeight: "80px",
                backgroundColor: isSelected ? "rgba(255,68,68,0.08)" : "#1A1A24",
                borderLeft: isSelected ? "3px solid #FF4444" : "3px solid transparent",
                border: isSelected
                  ? "1px solid rgba(255,68,68,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderLeftWidth: "3px",
              }}
            >
              <span className="text-[32px] leading-none flex-shrink-0">{emoji}</span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-bold text-white text-[15px]">{label}</span>
                <span className="text-[13px]" style={{ color: "#6B6B80" }}>
                  {description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

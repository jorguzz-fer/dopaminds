import { useState } from "react";
import type { AddictionCategory } from "@dopamind/shared";
import { ADDICTION_CATEGORIES, ADDICTION_CATEGORY_VALUES } from "@dopamind/shared";
import { cn } from "@dopamind/ui";

interface Step1Props {
  onNext: (data: { category: AddictionCategory }) => void;
}

export function Step1Category({ onNext }: Step1Props) {
  const [selected, setSelected] = useState<AddictionCategory | null>(null);

  function handleSelect(category: AddictionCategory) {
    setSelected(category);
    setTimeout(() => onNext({ category }), 260);
  }

  return (
    <div className="flex flex-col gap-7 px-5 pt-6 pb-[env(safe-area-inset-bottom,20px)]">
      <div className="space-y-2">
        <h1 className="text-[28px] font-semibold text-white leading-tight tracking-tight">
          O que você quer resetar?
        </h1>
        <p className="text-sm text-white/50">Escolha sua principal batalha</p>
      </div>

      <div className="flex flex-col gap-3">
        {ADDICTION_CATEGORY_VALUES.map((category) => {
          const { label, emoji, description } = ADDICTION_CATEGORIES[category];
          const active = selected === category;

          return (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={cn(
                "group flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98]",
                active
                  ? "bg-gradient-to-br from-violet-500/25 to-fuchsia-500/15 border border-violet-400/50 shadow-[0_0_30px_-10px_rgba(167,139,250,0.6)]"
                  : "bg-white/[0.04] border border-white/10 hover:bg-white/[0.06]",
              )}
            >
              <span
                className={cn(
                  "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-[28px] transition-colors",
                  active ? "bg-violet-500/30" : "bg-white/5",
                )}
              >
                {emoji}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-white">{label}</span>
                <span className="text-[13px] text-white/55 leading-snug">{description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

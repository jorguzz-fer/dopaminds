import type { AddictionCategory } from "../types/user.js";

export const ADDICTION_CATEGORIES: Record<AddictionCategory, { label: string; emoji: string; description: string }> = {
  social_media: {
    label: "Redes Sociais / Celular",
    emoji: "📱",
    description: "Instagram, TikTok, scroll infinito",
  },
  pornography: {
    label: "Pornografia",
    emoji: "🔒",
    description: "Sites de streaming, conteúdo adulto",
  },
  gaming: {
    label: "Jogos / Apostas",
    emoji: "🎮",
    description: "Gaming excessivo, bets esportivas",
  },
  shopping: {
    label: "Compras",
    emoji: "🛒",
    description: "E-commerce, compras por impulso",
  },
};

export const ADDICTION_CATEGORY_VALUES: AddictionCategory[] = [
  "social_media",
  "pornography",
  "gaming",
  "shopping",
];

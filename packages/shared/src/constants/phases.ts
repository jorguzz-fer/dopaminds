export interface RecoveryPhase {
  phase: number;
  name: string;
  dayRange: [number, number];
  description: string;
  neuroscience: string;
}

export const RECOVERY_PHASES: RecoveryPhase[] = [
  {
    phase: 1,
    name: "Crise",
    dayRange: [1, 3],
    description: "Desconforto extremo, vibrações fantasma, impulsos constantes",
    neuroscience: "Seu cérebro está sentindo falta do estímulo supranormal. A dopamina basal caiu, mas os receptores D2 ainda não começaram a se recuperar.",
  },
  {
    phase: 2,
    name: "Pico",
    dayRange: [4, 7],
    description: "Pico de tédio e ansiedade — ponto crítico de abandono",
    neuroscience: "Este é o momento mais difícil. Seu córtex pré-frontal está lutando contra o sistema límbico. A boa notícia: a recuperação cognitiva já começou.",
  },
  {
    phase: 3,
    name: "Clareza",
    dayRange: [8, 21],
    description: "Primeiros sinais de clareza mental, melhora de humor e sono",
    neuroscience: "Seus receptores D2 estão se recalibrando. Atividades naturais estão começando a produzir prazer novamente. Novos circuitos neurais estão se formando.",
  },
  {
    phase: 4,
    name: "Consolidação",
    dayRange: [22, 90],
    description: "Mudança comportamental real, paz, integração",
    neuroscience: "Novos circuitos neurais estão se solidificando como padrões default. Seu córtex pré-frontal recuperou atividade significativa.",
  },
];

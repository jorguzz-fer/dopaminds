# DopaMind Sprint 0 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the secure monorepo foundation — Turborepo, Fastify API with 6-layer security, Better Auth, Drizzle ORM with encrypted fields, Docker Compose for local dev, and a React + Vite PWA shell.

**Architecture:** Fortress Layered security — Cloudflare → Traefik → Fastify (helmet/cors/rate-limit/Zod) → Better Auth (session-based, anonymous, 2FA) → AES-256-GCM field encryption with envelope encryption → PostgreSQL with zero exposed ports. All services on Docker internal network.

**Tech Stack:** Turborepo, Fastify 5, React 19, Vite 8, Tailwind 4, Drizzle ORM, Better Auth, PostgreSQL 16 + pgvector, Zod, Node.js crypto, Vitest

---

## File Map

### Root
- `package.json` — workspace root, scripts
- `turbo.json` — pipeline config (build, dev, test, lint, db:migrate)
- `tsconfig.base.json` — shared TS config
- `.env.example` — template with all required env vars (no secrets)
- `.gitignore` — node_modules, .env, dist, .turbo, docker volumes
- `docker/docker-compose.yml` — Postgres + pgvector for local dev
- `docker/Dockerfile.api` — production API build

### packages/shared
- `packages/shared/package.json` — package config
- `packages/shared/tsconfig.json` — extends base
- `packages/shared/src/index.ts` — barrel export
- `packages/shared/src/types/user.ts` — User, UserAddiction types
- `packages/shared/src/types/checkin.ts` — DailyCheckin, RestorationLog types
- `packages/shared/src/types/education.ts` — EducationProgress, AiSession types
- `packages/shared/src/types/insights.ts` — CollectiveInsight type
- `packages/shared/src/constants/phases.ts` — recovery phases 1-4
- `packages/shared/src/constants/categories.ts` — addiction categories
- `packages/shared/src/constants/index.ts` — barrel export

### packages/science
- `packages/science/package.json` — package config
- `packages/science/tsconfig.json` — extends base
- `packages/science/src/index.ts` — barrel export
- `packages/science/src/phases.ts` — phase definitions and transition logic
- `packages/science/src/scoring.ts` — severity scoring algorithm

### apps/api
- `apps/api/package.json` — API dependencies
- `apps/api/tsconfig.json` — extends base
- `apps/api/src/index.ts` — server entrypoint
- `apps/api/src/app.ts` — Fastify app factory (plugins, routes)
- `apps/api/src/plugins/helmet.ts` — @fastify/helmet config
- `apps/api/src/plugins/cors.ts` — @fastify/cors config
- `apps/api/src/plugins/rate-limit.ts` — @fastify/rate-limit config
- `apps/api/src/plugins/cookie.ts` — @fastify/cookie config
- `apps/api/src/auth.ts` — Better Auth instance (Drizzle adapter, anonymous plugin, session config)
- `apps/api/src/routes/auth.ts` — Better Auth catch-all route
- `apps/api/src/routes/health.ts` — health check endpoint
- `apps/api/src/middleware/session.ts` — session validation helper
- `apps/api/src/crypto/envelope.ts` — AES-256-GCM encrypt/decrypt, envelope encryption, HMAC
- `apps/api/src/crypto/envelope.test.ts` — crypto module tests
- `apps/api/src/db/index.ts` — Drizzle client instance
- `apps/api/src/db/schema/users.ts` — users table schema
- `apps/api/src/db/schema/user-addictions.ts` — user_addictions table schema
- `apps/api/src/db/schema/daily-checkins.ts` — daily_checkins table schema
- `apps/api/src/db/schema/restoration-log.ts` — restoration_log table schema
- `apps/api/src/db/schema/education-progress.ts` — education_progress table schema
- `apps/api/src/db/schema/ai-sessions.ts` — ai_sessions table schema
- `apps/api/src/db/schema/collective-insights.ts` — collective_insights table schema
- `apps/api/src/db/schema/index.ts` — barrel export of all schemas
- `apps/api/drizzle.config.ts` — Drizzle Kit config

### apps/web
- `apps/web/package.json` — web dependencies
- `apps/web/tsconfig.json` — extends base
- `apps/web/vite.config.ts` — Vite config
- `apps/web/tailwind.config.ts` — Tailwind config
- `apps/web/index.html` — HTML entry
- `apps/web/public/manifest.json` — PWA manifest
- `apps/web/src/main.tsx` — React entry
- `apps/web/src/App.tsx` — root component
- `apps/web/src/lib/api.ts` — API client (fetch wrapper)
- `apps/web/src/lib/auth.ts` — Better Auth client

---

## Task 1: Initialize Monorepo Root

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
git init
```

- [ ] **Step 2: Create root package.json**

```json
{
  "name": "dopamind",
  "private": true,
  "packageManager": "pnpm@10.11.0",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate"
  },
  "devDependencies": {
    "turbo": "^2.9.6",
    "typescript": "^5.8.3"
  }
}
```

- [ ] **Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

- [ ] **Step 5: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
dist/
.turbo/
.env
.env.local
*.log
docker/data/
.DS_Store
```

- [ ] **Step 7: Create .env.example**

```bash
# Database
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind

# Encryption
MASTER_ENCRYPTION_KEY=generate-with-openssl-rand-hex-32
HMAC_SECRET=generate-with-openssl-rand-hex-32

# Better Auth
BETTER_AUTH_SECRET=generate-with-openssl-rand-hex-32
BETTER_AUTH_URL=http://localhost:4000

# Client
CLIENT_ORIGIN=http://localhost:5173

# Google OAuth (optional for dev)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Apple OAuth (optional for dev)
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
```

- [ ] **Step 8: Install pnpm and dependencies**

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
pnpm install
```

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .gitignore .env.example
git commit -m "feat: initialize monorepo with Turborepo"
```

---

## Task 2: Docker Compose for Local Dev

**Files:**
- Create: `docker/docker-compose.yml`
- Create: `docker/Dockerfile.api`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    restart: unless-stopped
    environment:
      POSTGRES_USER: dopamind
      POSTGRES_PASSWORD: dopamind_dev
      POSTGRES_DB: dopamind
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dopamind"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

Note: Postgres binds to `127.0.0.1` only — not exposed to the network. MinIO is out of scope for Sprint 0.

- [ ] **Step 2: Create Dockerfile.api**

```dockerfile
FROM node:22-slim AS base
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
COPY packages/science/package.json packages/science/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo build --filter=@dopamind/api

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 4000
USER node
CMD ["node", "dist/index.js"]
```

- [ ] **Step 3: Start Postgres and verify**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
docker compose -f docker/docker-compose.yml up -d
docker compose -f docker/docker-compose.yml ps
```

Expected: postgres service is `healthy`.

- [ ] **Step 4: Verify pgvector extension is available**

```bash
docker compose -f docker/docker-compose.yml exec postgres psql -U dopamind -c "CREATE EXTENSION IF NOT EXISTS vector; SELECT extversion FROM pg_extension WHERE extname = 'vector';"
```

Expected: extension created, version shown.

- [ ] **Step 5: Commit**

```bash
git add docker/
git commit -m "feat: add Docker Compose with PostgreSQL 16 + pgvector"
```

---

## Task 3: Shared Package — Types and Constants

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/types/user.ts`
- Create: `packages/shared/src/types/checkin.ts`
- Create: `packages/shared/src/types/education.ts`
- Create: `packages/shared/src/types/insights.ts`
- Create: `packages/shared/src/constants/phases.ts`
- Create: `packages/shared/src/constants/categories.ts`
- Create: `packages/shared/src/constants/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@dopamind/shared",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create types/user.ts**

```typescript
export interface User {
  id: string;
  createdAt: Date;
  anonymous: boolean;
  onboardingDone: boolean;
  currentPhase: number;
  streakDays: number;
  lastCheckIn: Date | null;
  timezone: string | null;
}

export interface UserAddiction {
  id: string;
  userId: string;
  category: AddictionCategory;
  severityScore: number;
  baselineUsage: Record<string, unknown> | null;
  currentGoal: Record<string, unknown> | null;
  startedAt: Date;
}

export type AddictionCategory = "social_media" | "pornography" | "gaming" | "shopping";
```

- [ ] **Step 4: Create types/checkin.ts**

```typescript
export interface DailyCheckin {
  id: string;
  userId: string;
  date: string;
  moodScore: number;
  urgeLevel: number;
  urgeTriggers: string[] | null;
  healthyActivities: string[] | null;
  relapse: boolean;
  relapseDuration: number | null;
  reflection: string | null;
  phase: number;
}

export interface RestorationLog {
  id: string;
  userId: string;
  date: string;
  exerciseMinutes: number;
  sleepHours: number | null;
  meditationMinutes: number;
  sunlightMinutes: number;
  socialConnection: boolean;
  coldExposure: boolean;
}

export type UrgeTrigger =
  | "boredom"
  | "stress"
  | "loneliness"
  | "social"
  | "nighttime"
  | "morning"
  | "weekend"
  | "work"
  | "anxiety"
  | "sadness";
```

- [ ] **Step 5: Create types/education.ts**

```typescript
export interface EducationProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: Date;
  quizScore: number | null;
}

export interface AiSession {
  id: string;
  userId: string;
  startedAt: Date;
  context: AiSessionContext;
  messages: AiMessage[];
  outcome: string | null;
}

export type AiSessionContext = "urge" | "checkin" | "education" | "crisis";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
```

- [ ] **Step 6: Create types/insights.ts**

```typescript
export interface CollectiveInsight {
  id: string;
  category: string;
  insightType: InsightType;
  content: string;
  sampleSize: number;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsightType = "trigger_pattern" | "activity_efficacy" | "phase_risk";
```

- [ ] **Step 7: Create constants/categories.ts**

```typescript
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
```

- [ ] **Step 8: Create constants/phases.ts**

```typescript
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
```

- [ ] **Step 9: Create constants/index.ts**

```typescript
export { ADDICTION_CATEGORIES, ADDICTION_CATEGORY_VALUES } from "./categories.js";
export { RECOVERY_PHASES, type RecoveryPhase } from "./phases.js";
```

- [ ] **Step 10: Create src/index.ts barrel export**

```typescript
export * from "./types/user.js";
export * from "./types/checkin.js";
export * from "./types/education.js";
export * from "./types/insights.js";
export * from "./constants/index.js";
```

- [ ] **Step 11: Run type check**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
pnpm install
pnpm --filter @dopamind/shared lint
```

Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add packages/shared/
git commit -m "feat: add shared types and constants package"
```

---

## Task 4: Science Package — Phases and Scoring

**Files:**
- Create: `packages/science/package.json`
- Create: `packages/science/tsconfig.json`
- Create: `packages/science/src/index.ts`
- Create: `packages/science/src/phases.ts`
- Create: `packages/science/src/scoring.ts`
- Create: `packages/science/src/phases.test.ts`
- Create: `packages/science/src/scoring.test.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@dopamind/science",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@dopamind/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vitest": "^4.1.4"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Write failing test for phases**

Create `packages/science/src/phases.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getPhaseForDay, getPhaseProgress } from "./phases.js";

describe("getPhaseForDay", () => {
  it("returns phase 1 for days 1-3", () => {
    expect(getPhaseForDay(1)).toBe(1);
    expect(getPhaseForDay(3)).toBe(1);
  });

  it("returns phase 2 for days 4-7", () => {
    expect(getPhaseForDay(4)).toBe(2);
    expect(getPhaseForDay(7)).toBe(2);
  });

  it("returns phase 3 for days 8-21", () => {
    expect(getPhaseForDay(8)).toBe(3);
    expect(getPhaseForDay(21)).toBe(3);
  });

  it("returns phase 4 for days 22+", () => {
    expect(getPhaseForDay(22)).toBe(4);
    expect(getPhaseForDay(90)).toBe(4);
    expect(getPhaseForDay(365)).toBe(4);
  });

  it("returns phase 1 for day 0 or negative", () => {
    expect(getPhaseForDay(0)).toBe(1);
    expect(getPhaseForDay(-1)).toBe(1);
  });
});

describe("getPhaseProgress", () => {
  it("returns 0.33 for day 1 in phase 1 (3-day phase)", () => {
    const progress = getPhaseProgress(1);
    expect(progress).toBeCloseTo(0.33, 1);
  });

  it("returns 1.0 for last day of phase 1", () => {
    const progress = getPhaseProgress(3);
    expect(progress).toBeCloseTo(1.0, 1);
  });

  it("returns progress within phase 3", () => {
    const progress = getPhaseProgress(14);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThanOrEqual(1);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

```bash
pnpm --filter @dopamind/science test
```

Expected: FAIL — module not found.

- [ ] **Step 5: Implement phases.ts**

Create `packages/science/src/phases.ts`:

```typescript
import { RECOVERY_PHASES } from "@dopamind/shared";

export function getPhaseForDay(day: number): number {
  if (day < 1) return 1;
  for (const phase of RECOVERY_PHASES) {
    const [start, end] = phase.dayRange;
    if (day >= start && day <= end) return phase.phase;
  }
  return RECOVERY_PHASES[RECOVERY_PHASES.length - 1].phase;
}

export function getPhaseProgress(day: number): number {
  if (day < 1) return 0;
  const phaseNum = getPhaseForDay(day);
  const phase = RECOVERY_PHASES.find((p) => p.phase === phaseNum);
  if (!phase) return 0;
  const [start, end] = phase.dayRange;
  const totalDays = end - start + 1;
  const daysIn = Math.min(day - start + 1, totalDays);
  return daysIn / totalDays;
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
pnpm --filter @dopamind/science test
```

Expected: all tests PASS.

- [ ] **Step 7: Write failing test for scoring**

Create `packages/science/src/scoring.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { calculateSeverityScore } from "./scoring.js";

describe("calculateSeverityScore", () => {
  it("returns low severity for minimal usage", () => {
    const score = calculateSeverityScore({
      hoursPerDay: 1,
      failedAttempts: 0,
      negativeConsequences: false,
      withdrawalSymptoms: false,
      interferesWithLife: false,
    });
    expect(score).toBeLessThanOrEqual(3);
    expect(score).toBeGreaterThanOrEqual(1);
  });

  it("returns high severity for heavy usage with consequences", () => {
    const score = calculateSeverityScore({
      hoursPerDay: 8,
      failedAttempts: 5,
      negativeConsequences: true,
      withdrawalSymptoms: true,
      interferesWithLife: true,
    });
    expect(score).toBeGreaterThanOrEqual(8);
    expect(score).toBeLessThanOrEqual(10);
  });

  it("returns moderate severity for mixed signals", () => {
    const score = calculateSeverityScore({
      hoursPerDay: 4,
      failedAttempts: 2,
      negativeConsequences: true,
      withdrawalSymptoms: false,
      interferesWithLife: false,
    });
    expect(score).toBeGreaterThanOrEqual(4);
    expect(score).toBeLessThanOrEqual(7);
  });

  it("clamps score between 1 and 10", () => {
    const low = calculateSeverityScore({
      hoursPerDay: 0,
      failedAttempts: 0,
      negativeConsequences: false,
      withdrawalSymptoms: false,
      interferesWithLife: false,
    });
    expect(low).toBe(1);

    const high = calculateSeverityScore({
      hoursPerDay: 24,
      failedAttempts: 100,
      negativeConsequences: true,
      withdrawalSymptoms: true,
      interferesWithLife: true,
    });
    expect(high).toBe(10);
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

```bash
pnpm --filter @dopamind/science test
```

Expected: FAIL — module not found.

- [ ] **Step 9: Implement scoring.ts**

Create `packages/science/src/scoring.ts`:

```typescript
export interface SeverityInput {
  hoursPerDay: number;
  failedAttempts: number;
  negativeConsequences: boolean;
  withdrawalSymptoms: boolean;
  interferesWithLife: boolean;
}

export function calculateSeverityScore(input: SeverityInput): number {
  let score = 0;

  // Hours per day: 0-2 = 1pt, 3-5 = 2pt, 6+ = 3pt
  if (input.hoursPerDay <= 2) score += 1;
  else if (input.hoursPerDay <= 5) score += 2;
  else score += 3;

  // Failed quit attempts: 0 = 0pt, 1-2 = 1pt, 3+ = 2pt
  if (input.failedAttempts >= 3) score += 2;
  else if (input.failedAttempts >= 1) score += 1;

  // Boolean factors: each adds ~1.5 points
  if (input.negativeConsequences) score += 2;
  if (input.withdrawalSymptoms) score += 1;
  if (input.interferesWithLife) score += 2;

  return Math.max(1, Math.min(10, score));
}
```

- [ ] **Step 10: Run test to verify it passes**

```bash
pnpm --filter @dopamind/science test
```

Expected: all tests PASS.

- [ ] **Step 11: Create src/index.ts**

```typescript
export { getPhaseForDay, getPhaseProgress } from "./phases.js";
export { calculateSeverityScore, type SeverityInput } from "./scoring.js";
```

- [ ] **Step 12: Commit**

```bash
git add packages/science/
git commit -m "feat: add science package with phases and severity scoring"
```

---

## Task 5: API — Fastify Server with Security Plugins

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/plugins/helmet.ts`
- Create: `apps/api/src/plugins/cors.ts`
- Create: `apps/api/src/plugins/rate-limit.ts`
- Create: `apps/api/src/plugins/cookie.ts`
- Create: `apps/api/src/routes/health.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@dopamind/api",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "lint": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  },
  "dependencies": {
    "@dopamind/shared": "workspace:*",
    "@dopamind/science": "workspace:*",
    "@fastify/cookie": "^11.0.2",
    "@fastify/cors": "^11.2.0",
    "@fastify/helmet": "^13.0.2",
    "@fastify/rate-limit": "^10.3.0",
    "better-auth": "^1.6.2",
    "drizzle-orm": "^0.45.2",
    "fastify": "^5.8.4",
    "postgres": "^3.4.7",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.10",
    "tsx": "^4.21.0",
    "typescript": "^5.8.3",
    "vitest": "^4.1.4"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create plugins/helmet.ts**

```typescript
import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";

export async function registerHelmet(app: FastifyInstance) {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
}
```

- [ ] **Step 4: Create plugins/cors.ts**

```typescript
import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export async function registerCors(app: FastifyInstance) {
  const origin = process.env.CLIENT_ORIGIN;
  if (!origin) throw new Error("CLIENT_ORIGIN env var is required");

  await app.register(cors, {
    origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  });
}
```

- [ ] **Step 5: Create plugins/rate-limit.ts**

```typescript
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

export async function registerRateLimit(app: FastifyInstance) {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: "Rate limit exceeded. Try again later.",
    }),
  });
}
```

- [ ] **Step 6: Create plugins/cookie.ts**

```typescript
import cookie from "@fastify/cookie";
import type { FastifyInstance } from "fastify";

export async function registerCookie(app: FastifyInstance) {
  await app.register(cookie);
}
```

- [ ] **Step 7: Create routes/health.ts**

```typescript
import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
}
```

- [ ] **Step 8: Create app.ts**

```typescript
import Fastify from "fastify";
import { registerHelmet } from "./plugins/helmet.js";
import { registerCors } from "./plugins/cors.js";
import { registerRateLimit } from "./plugins/rate-limit.js";
import { registerCookie } from "./plugins/cookie.js";
import { healthRoutes } from "./routes/health.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty" }
          : undefined,
    },
    trustProxy: true,
  });

  // Security plugins
  await registerHelmet(app);
  await registerCors(app);
  await registerRateLimit(app);
  await registerCookie(app);

  // Error handler — never expose internals
  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode ?? 500;
    reply.status(statusCode).send({
      statusCode,
      error: statusCode >= 500 ? "Internal Server Error" : error.message,
    });
  });

  // Routes
  await app.register(healthRoutes);

  return app;
}
```

- [ ] **Step 9: Create index.ts**

```typescript
import { buildApp } from "./app.js";

const PORT = parseInt(process.env.PORT ?? "4000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.fatal(err);
    process.exit(1);
  }
}

start();
```

- [ ] **Step 10: Install dependencies and verify**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
pnpm install
CLIENT_ORIGIN=http://localhost:5173 pnpm --filter @dopamind/api dev &
sleep 3
curl -s http://localhost:4000/health | jq .
kill %1
```

Expected: `{ "status": "ok", "timestamp": "..." }`

- [ ] **Step 11: Verify security headers**

```bash
CLIENT_ORIGIN=http://localhost:5173 pnpm --filter @dopamind/api dev &
sleep 3
curl -sI http://localhost:4000/health | grep -iE "(x-frame|x-content|strict-transport|content-security)"
kill %1
```

Expected: headers like `X-Frame-Options`, `Content-Security-Policy`, etc.

- [ ] **Step 12: Commit**

```bash
git add apps/api/
git commit -m "feat: add Fastify API with security plugins (helmet, cors, rate-limit)"
```

---

## Task 6: Crypto Module — Envelope Encryption

**Files:**
- Create: `apps/api/src/crypto/envelope.ts`
- Create: `apps/api/src/crypto/envelope.test.ts`

- [ ] **Step 1: Write failing tests**

Create `apps/api/src/crypto/envelope.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { createCryptoService, type CryptoService } from "./envelope.js";

let crypto: CryptoService;

beforeAll(() => {
  // 32 bytes hex = 64 chars
  const masterKey = "a".repeat(64);
  const hmacSecret = "b".repeat(64);
  crypto = createCryptoService(masterKey, hmacSecret);
});

describe("envelope encryption", () => {
  it("encrypts and decrypts a string", () => {
    const plaintext = "I feel stressed and want to scroll";
    const { ciphertext, encryptedDataKey } = crypto.encrypt(plaintext);

    expect(ciphertext).toBeInstanceOf(Buffer);
    expect(encryptedDataKey).toBeInstanceOf(Buffer);
    expect(ciphertext.toString()).not.toContain(plaintext);

    const decrypted = crypto.decrypt(ciphertext, encryptedDataKey);
    expect(decrypted).toBe(plaintext);
  });

  it("encrypts and decrypts JSON", () => {
    const data = { triggers: ["boredom", "stress"], notes: "hard day" };
    const json = JSON.stringify(data);
    const { ciphertext, encryptedDataKey } = crypto.encrypt(json);

    const decrypted = crypto.decrypt(ciphertext, encryptedDataKey);
    expect(JSON.parse(decrypted)).toEqual(data);
  });

  it("produces different ciphertext for same plaintext (unique IV + data key)", () => {
    const plaintext = "same input";
    const result1 = crypto.encrypt(plaintext);
    const result2 = crypto.encrypt(plaintext);

    expect(result1.ciphertext).not.toEqual(result2.ciphertext);
    expect(result1.encryptedDataKey).not.toEqual(result2.encryptedDataKey);
  });

  it("fails to decrypt with wrong master key", () => {
    const plaintext = "secret data";
    const { ciphertext, encryptedDataKey } = crypto.encrypt(plaintext);

    const wrongCrypto = createCryptoService("c".repeat(64), "b".repeat(64));
    expect(() => wrongCrypto.decrypt(ciphertext, encryptedDataKey)).toThrow();
  });
});

describe("HMAC", () => {
  it("produces consistent HMAC for same input", () => {
    const hmac1 = crypto.hmac("boredom");
    const hmac2 = crypto.hmac("boredom");
    expect(hmac1).toBe(hmac2);
  });

  it("produces different HMAC for different input", () => {
    const hmac1 = crypto.hmac("boredom");
    const hmac2 = crypto.hmac("stress");
    expect(hmac1).not.toBe(hmac2);
  });

  it("HMAC does not reveal the original value", () => {
    const hmac = crypto.hmac("boredom");
    expect(hmac).not.toContain("boredom");
    expect(hmac).toMatch(/^[a-f0-9]{64}$/);
  });

  it("hmacArray produces sorted HMAC of joined values", () => {
    const hmac = crypto.hmacArray(["stress", "boredom"]);
    expect(hmac).toMatch(/^[a-f0-9]{64}$/);
    // Sorted, so order doesn't matter
    const hmac2 = crypto.hmacArray(["boredom", "stress"]);
    expect(hmac).toBe(hmac2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter @dopamind/api test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement envelope.ts**

Create `apps/api/src/crypto/envelope.ts`:

```typescript
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const DATA_KEY_LENGTH = 32;

export interface EncryptResult {
  ciphertext: Buffer;
  encryptedDataKey: Buffer;
}

export interface CryptoService {
  encrypt(plaintext: string): EncryptResult;
  decrypt(ciphertext: Buffer, encryptedDataKey: Buffer): string;
  hmac(value: string): string;
  hmacArray(values: string[]): string;
}

export function createCryptoService(
  masterKeyHex: string,
  hmacSecretHex: string,
): CryptoService {
  const masterKey = Buffer.from(masterKeyHex, "hex");
  const hmacSecret = Buffer.from(hmacSecretHex, "hex");

  if (masterKey.length !== 32) {
    throw new Error("MASTER_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }
  if (hmacSecret.length !== 32) {
    throw new Error("HMAC_SECRET must be 32 bytes (64 hex chars)");
  }

  function encryptWithKey(plaintext: Buffer, key: Buffer): Buffer {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Format: IV (12) + authTag (16) + ciphertext
    return Buffer.concat([iv, authTag, encrypted]);
  }

  function decryptWithKey(packed: Buffer, key: Buffer): Buffer {
    const iv = packed.subarray(0, IV_LENGTH);
    const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }

  return {
    encrypt(plaintext: string): EncryptResult {
      // Generate random data key
      const dataKey = randomBytes(DATA_KEY_LENGTH);
      // Encrypt plaintext with data key
      const ciphertext = encryptWithKey(Buffer.from(plaintext, "utf-8"), dataKey);
      // Encrypt data key with master key
      const encryptedDataKey = encryptWithKey(dataKey, masterKey);
      return { ciphertext, encryptedDataKey };
    },

    decrypt(ciphertext: Buffer, encryptedDataKey: Buffer): string {
      // Decrypt data key with master key
      const dataKey = decryptWithKey(encryptedDataKey, masterKey);
      // Decrypt ciphertext with data key
      const plaintext = decryptWithKey(ciphertext, dataKey);
      return plaintext.toString("utf-8");
    },

    hmac(value: string): string {
      return createHmac("sha256", hmacSecret).update(value).digest("hex");
    },

    hmacArray(values: string[]): string {
      const sorted = [...values].sort().join("|");
      return createHmac("sha256", hmacSecret).update(sorted).digest("hex");
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm --filter @dopamind/api test
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/crypto/
git commit -m "feat: add envelope encryption module (AES-256-GCM + HMAC)"
```

---

## Task 7: Database — Drizzle ORM Schemas

**Files:**
- Create: `apps/api/src/db/index.ts`
- Create: `apps/api/src/db/schema/users.ts`
- Create: `apps/api/src/db/schema/user-addictions.ts`
- Create: `apps/api/src/db/schema/daily-checkins.ts`
- Create: `apps/api/src/db/schema/restoration-log.ts`
- Create: `apps/api/src/db/schema/education-progress.ts`
- Create: `apps/api/src/db/schema/ai-sessions.ts`
- Create: `apps/api/src/db/schema/collective-insights.ts`
- Create: `apps/api/src/db/schema/index.ts`
- Create: `apps/api/drizzle.config.ts`

- [ ] **Step 1: Create db/index.ts**

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL env var is required");

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
```

- [ ] **Step 2: Create db/schema/users.ts**

```typescript
import {
  pgTable,
  uuid,
  timestamp,
  boolean,
  integer,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  anonymous: boolean("anonymous").notNull().default(true),
  onboardingDone: boolean("onboarding_done").notNull().default(false),
  currentPhase: integer("current_phase").notNull().default(1),
  streakDays: integer("streak_days").notNull().default(0),
  lastCheckIn: timestamp("last_check_in", { withTimezone: true }),
  timezone: text("timezone"),
});
```

- [ ] **Step 3: Create db/schema/user-addictions.ts**

```typescript
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  customType,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const userAddictions = pgTable(
  "user_addictions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    severityScore: integer("severity_score").notNull(),
    baselineUsage: bytea("baseline_usage"),
    currentGoal: bytea("current_goal"),
    encryptedDataKey: bytea("encrypted_data_key").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      "valid_category",
      sql`${table.category} IN ('social_media','pornography','gaming','shopping')`,
    ),
    check(
      "valid_severity",
      sql`${table.severityScore} BETWEEN 1 AND 10`,
    ),
  ],
);
```

- [ ] **Step 4: Create db/schema/daily-checkins.ts**

```typescript
import {
  pgTable,
  uuid,
  date,
  integer,
  boolean,
  text,
  unique,
  customType,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    moodScore: integer("mood_score").notNull(),
    urgeLevel: integer("urge_level").notNull(),
    urgeTriggers: bytea("urge_triggers"),
    urgeTriggersHmac: text("urge_triggers_hmac"),
    healthyActivities: bytea("healthy_activities"),
    relapse: boolean("relapse").notNull().default(false),
    relapseDuration: integer("relapse_duration"),
    reflection: bytea("reflection"),
    encryptedDataKey: bytea("encrypted_data_key").notNull(),
    phase: integer("phase").notNull(),
  },
  (table) => [
    unique("daily_checkins_user_date").on(table.userId, table.date),
    check("valid_mood", sql`${table.moodScore} BETWEEN 1 AND 5`),
    check("valid_urge", sql`${table.urgeLevel} BETWEEN 1 AND 10`),
  ],
);
```

- [ ] **Step 5: Create db/schema/restoration-log.ts**

```typescript
import {
  pgTable,
  uuid,
  date,
  integer,
  boolean,
  doublePrecision,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const restorationLog = pgTable(
  "restoration_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    exerciseMinutes: integer("exercise_minutes").default(0),
    sleepHours: doublePrecision("sleep_hours"),
    meditationMinutes: integer("meditation_minutes").default(0),
    sunlightMinutes: integer("sunlight_minutes").default(0),
    socialConnection: boolean("social_connection").default(false),
    coldExposure: boolean("cold_exposure").default(false),
  },
  (table) => [
    unique("restoration_log_user_date").on(table.userId, table.date),
  ],
);
```

- [ ] **Step 6: Create db/schema/education-progress.ts**

```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const educationProgress = pgTable(
  "education_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
    quizScore: integer("quiz_score"),
  },
  (table) => [
    unique("education_progress_user_lesson").on(table.userId, table.lessonId),
  ],
);
```

- [ ] **Step 7: Create db/schema/ai-sessions.ts**

```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  customType,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const aiSessions = pgTable(
  "ai_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    context: text("context").notNull(),
    messages: bytea("messages").notNull(),
    outcome: bytea("outcome"),
    encryptedDataKey: bytea("encrypted_data_key").notNull(),
  },
  (table) => [
    check(
      "valid_context",
      sql`${table.context} IN ('urge','checkin','education','crisis')`,
    ),
  ],
);
```

- [ ] **Step 8: Create db/schema/collective-insights.ts**

```typescript
import {
  pgTable,
  uuid,
  text,
  integer,
  doublePrecision,
  timestamp,
  customType,
} from "drizzle-orm/pg-core";

const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(1536)";
  },
});

export const collectiveInsights = pgTable("collective_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(),
  insightType: text("insight_type").notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding"),
  sampleSize: integer("sample_size").notNull(),
  confidence: doublePrecision("confidence").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
```

- [ ] **Step 9: Create db/schema/index.ts**

```typescript
export { users } from "./users.js";
export { userAddictions } from "./user-addictions.js";
export { dailyCheckins } from "./daily-checkins.js";
export { restorationLog } from "./restoration-log.js";
export { educationProgress } from "./education-progress.js";
export { aiSessions } from "./ai-sessions.js";
export { collectiveInsights } from "./collective-insights.js";
```

- [ ] **Step 10: Create drizzle.config.ts**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 11: Generate and run migration**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
# Make sure Postgres is running
docker compose -f docker/docker-compose.yml up -d
# Generate migration
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind pnpm --filter @dopamind/api db:generate
# Apply migration
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind pnpm --filter @dopamind/api db:migrate
```

Expected: migration files generated in `apps/api/drizzle/`, migration applied successfully.

- [ ] **Step 12: Verify tables exist**

```bash
docker compose -f docker/docker-compose.yml exec postgres psql -U dopamind -c "\dt"
```

Expected: all 7 tables listed.

- [ ] **Step 13: Commit**

```bash
git add apps/api/src/db/ apps/api/drizzle.config.ts apps/api/drizzle/
git commit -m "feat: add Drizzle ORM schemas with encrypted fields and migrations"
```

---

## Task 8: Better Auth Integration

**Files:**
- Create: `apps/api/src/auth.ts`
- Create: `apps/api/src/routes/auth.ts`
- Create: `apps/api/src/middleware/session.ts`

- [ ] **Step 1: Create auth.ts**

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { db } from "./db/index.js";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) throw new Error("BETTER_AUTH_SECRET env var is required");

const clientOrigin = process.env.CLIENT_ORIGIN;
if (!clientOrigin) throw new Error("CLIENT_ORIGIN env var is required");

export const auth = betterAuth({
  secret,
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // Data migration from anonymous → linked account happens here
        // Check-ins, progress, AI sessions are already linked by user_id
        // Better Auth handles the user record merge
        console.log(
          `Linked anonymous user ${anonymousUser.id} to ${newUser.id}`,
        );
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  advanced: {
    cookiePrefix: "dopamind",
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    },
  },
  trustedOrigins: [clientOrigin],
});
```

- [ ] **Step 2: Create routes/auth.ts**

```typescript
import type { FastifyInstance } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export async function authRoutes(app: FastifyInstance) {
  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      const url = new URL(
        request.url,
        `${request.protocol}://${request.hostname}`,
      );
      const headers = fromNodeHeaders(request.headers);
      const body = request.method === "POST" ? JSON.stringify(request.body) : undefined;

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(body ? { body } : {}),
      });

      const response = await auth.handler(req);

      reply.status(response.status);
      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      const text = await response.text();
      reply.send(text || null);
    },
  });
}
```

- [ ] **Step 3: Create middleware/session.ts**

```typescript
import type { FastifyRequest, FastifyReply } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export async function requireSession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    reply.status(401).send({ error: "Unauthorized" });
    return;
  }

  // Attach session to request for downstream use
  (request as any).session = session.session;
  (request as any).user = session.user;
}
```

- [ ] **Step 4: Register auth routes in app.ts**

Update `apps/api/src/app.ts` — add import and registration:

```typescript
import { authRoutes } from "./routes/auth.js";
```

Add after `await app.register(healthRoutes);`:

```typescript
  // Auth routes (Better Auth catch-all)
  await app.register(authRoutes);
```

- [ ] **Step 5: Generate Better Auth tables**

Better Auth creates its own tables (session, account, verification). Generate them:

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind npx @better-auth/cli generate --config apps/api/src/auth.ts
```

Then re-generate Drizzle migration to include Better Auth tables:

```bash
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind pnpm --filter @dopamind/api db:generate
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind pnpm --filter @dopamind/api db:migrate
```

- [ ] **Step 6: Verify auth endpoint responds**

```bash
CLIENT_ORIGIN=http://localhost:5173 \
BETTER_AUTH_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
BETTER_AUTH_URL=http://localhost:4000 \
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind \
pnpm --filter @dopamind/api dev &
sleep 3
curl -s http://localhost:4000/api/auth/ok
kill %1
```

Expected: Better Auth responds (not 404).

- [ ] **Step 7: Commit**

```bash
git add apps/api/src/auth.ts apps/api/src/routes/auth.ts apps/api/src/middleware/session.ts apps/api/src/app.ts
git commit -m "feat: add Better Auth with anonymous sessions and Fastify integration"
```

---

## Task 9: Web PWA Shell

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/public/manifest.json`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/lib/api.ts`
- Create: `apps/web/src/lib/auth.ts`
- Create: `apps/web/src/styles/globals.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@dopamind/web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@dopamind/shared": "workspace:*",
    "better-auth": "^1.6.2",
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "@types/react": "^19.1.4",
    "@types/react-dom": "^19.1.5",
    "@vitejs/plugin-react": "^6.0.1",
    "tailwindcss": "^4.2.2",
    "typescript": "^5.8.3",
    "vite": "^8.0.8"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
} satisfies Config;
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="manifest" href="/manifest.json" />
    <title>DopaMind — Reset consciente</title>
  </head>
  <body class="bg-slate-950 text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create public/manifest.json**

```json
{
  "name": "DopaMind",
  "short_name": "DopaMind",
  "description": "Reset consciente do sistema de recompensa cerebral",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 7: Create src/styles/globals.css**

```css
@import "tailwindcss";
```

- [ ] **Step 8: Create src/lib/api.ts**

```typescript
const API_BASE = "/api";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
```

- [ ] **Step 9: Create src/lib/auth.ts**

```typescript
import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: window.location.origin,
  plugins: [anonymousClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;
```

- [ ] **Step 10: Create src/App.tsx**

```tsx
import { useSession } from "./lib/auth";

export function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        Dopa<span className="text-indigo-400">Mind</span>
      </h1>
      <p className="text-lg text-slate-400">
        Reset consciente do sistema de recompensa cerebral
      </p>
      {session ? (
        <p className="text-sm text-slate-500">
          Sessão ativa: {session.user.id.slice(0, 8)}...
        </p>
      ) : (
        <p className="text-sm text-slate-500">Nenhuma sessão ativa</p>
      )}
    </div>
  );
}
```

- [ ] **Step 11: Create src/main.tsx**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 12: Install dependencies and verify**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
pnpm install
pnpm --filter @dopamind/web dev &
sleep 3
curl -sI http://localhost:5173 | head -5
kill %1
```

Expected: `200 OK` with HTML response.

- [ ] **Step 13: Commit**

```bash
git add apps/web/
git commit -m "feat: add React + Vite + Tailwind PWA shell with Better Auth client"
```

---

## Task 10: UI Package Scaffold

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@dopamind/ui",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.2.5"
  },
  "devDependencies": {
    "@types/react": "^19.1.4",
    "typescript": "^5.8.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/index.ts**

```typescript
// UI components will be added as features are built
export {};
```

- [ ] **Step 4: Install and verify**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
pnpm install
pnpm --filter @dopamind/ui lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/
git commit -m "feat: scaffold UI package for shared components"
```

---

## Task 11: Integration Test — Full Stack Smoke

**Files:**
- None created — this task validates everything works together.

- [ ] **Step 1: Ensure Docker Compose is running**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
docker compose -f docker/docker-compose.yml up -d
docker compose -f docker/docker-compose.yml ps
```

Expected: postgres is `healthy`.

- [ ] **Step 2: Start API server**

```bash
DATABASE_URL=postgresql://dopamind:dopamind_dev@localhost:5432/dopamind \
CLIENT_ORIGIN=http://localhost:5173 \
BETTER_AUTH_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
BETTER_AUTH_URL=http://localhost:4000 \
MASTER_ENCRYPTION_KEY=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
HMAC_SECRET=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb \
pnpm --filter @dopamind/api dev &
sleep 3
```

- [ ] **Step 3: Verify health endpoint**

```bash
curl -s http://localhost:4000/health | jq .
```

Expected: `{ "status": "ok", "timestamp": "..." }`

- [ ] **Step 4: Verify security headers are present**

```bash
curl -sI http://localhost:4000/health | grep -iE "(x-frame|content-security|x-content-type|strict-transport|x-dns-prefetch)"
```

Expected: security headers present.

- [ ] **Step 5: Verify rate limiting works**

```bash
for i in $(seq 1 105); do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4000/health; done | sort | uniq -c
```

Expected: ~100 responses with `200`, ~5 with `429`.

- [ ] **Step 6: Verify CORS blocks wrong origin**

```bash
curl -sI -H "Origin: https://evil.com" http://localhost:4000/health | grep -i "access-control"
```

Expected: no `Access-Control-Allow-Origin` header for evil.com.

- [ ] **Step 7: Verify Better Auth endpoint**

```bash
curl -s http://localhost:4000/api/auth/ok
```

Expected: Better Auth responds (not 404).

- [ ] **Step 8: Verify database tables**

```bash
docker compose -f docker/docker-compose.yml exec postgres psql -U dopamind -c "\dt" | grep -E "(users|user_addictions|daily_checkins|restoration_log|education_progress|ai_sessions|collective_insights|session|account|verification)"
```

Expected: all app tables + Better Auth tables listed.

- [ ] **Step 9: Stop API and clean up**

```bash
kill %1
```

- [ ] **Step 10: Verify Turbo pipeline works**

```bash
cd /Users/fernandojorge/Desktop/Projetos/apps/Dopamind
pnpm build
pnpm test
```

Expected: build and tests pass for all packages.

- [ ] **Step 11: Create .env from example**

```bash
cp .env.example .env
# Edit .env with generated secrets:
# openssl rand -hex 32  (for each secret)
```

- [ ] **Step 12: Final commit**

```bash
git add -A
git commit -m "feat: complete Sprint 0 — secure monorepo foundation"
```

---

## Spec Coverage Verification

| Spec Section | Task(s) |
|---|---|
| 2. Monorepo Structure | Tasks 1, 3, 4, 5, 9, 10 |
| 3. Tech Stack | All tasks use specified technologies |
| 4.1 Layer 1 Cloudflare | Out of scope (infra config, not code) |
| 4.2 Layer 2 Traefik | Out of scope (Coolify config) |
| 4.3 Layer 3 Fastify | Task 5 |
| 4.4 Layer 4 Better Auth | Task 8 |
| 4.5 Layer 5 App Encryption | Task 6 |
| 4.6 Layer 6 PostgreSQL | Tasks 2, 7 |
| 5. Data Model (all 7 tables) | Task 7 |
| 6. Auth Flows | Task 8 |
| 7. Field Encryption Flow | Task 6 |
| 8. Attack Protection | Tasks 5, 11 |
| 9. Infrastructure | Task 2 (Docker Compose), Task 5 (Dockerfile) |
| 10. Out of Scope | Confirmed not implemented |

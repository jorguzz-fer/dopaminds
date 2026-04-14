# DopaMind — Sprint 0 Design Spec

**Date:** 2026-04-12
**Status:** Approved
**Scope:** Monorepo setup, security foundation, data model, infrastructure

---

## 1. Overview

DopaMind is a brain reward system recovery app targeting behavioral addictions (social media, pornography, gaming/gambling, compulsive shopping). It uses gradual reduction based on neuroplasticity research, not total abstinence.

This spec covers Sprint 0: the secure foundation on which all features will be built.

### Decisions Summary

| Decision | Choice |
|---|---|
| Auth | Better Auth (session-based, 2FA, Argon2id) |
| Login methods | Anonymous + Email/password + Social Login (Google, Apple) |
| Encryption | At rest + TLS + application-level AES-256-GCM on sensitive fields |
| Attack protection | Cloudflare + Traefik WAF + Fastify rate limiting (3 layers) |
| Monorepo scope | API + Web/PWA first, mobile later |
| Security approach | Fortress Layered (6 independent layers) |
| Infrastructure | Self-hosted VPS with Coolify, zero external managed services |

---

## 2. Monorepo Structure

```
dopamind/
├── apps/
│   ├── web/                  # React + Vite + Tailwind (PWA)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── lib/          # API client, auth client
│   │   │   └── styles/
│   │   ├── public/
│   │   │   └── manifest.json # PWA manifest
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                  # Fastify backend
│       ├── src/
│       │   ├── routes/       # Routes organized by domain
│       │   ├── services/     # Business logic
│       │   ├── middleware/   # Auth, rate limit, validation
│       │   ├── plugins/      # Fastify plugins (helmet, cors, etc)
│       │   ├── ai/           # Claude API integration
│       │   ├── crypto/       # Field encryption module
│       │   └── db/           # Drizzle ORM schemas + migrations
│       └── package.json
│
├── packages/
│   ├── shared/               # Types, constants, utils
│   │   ├── types/
│   │   ├── constants/        # Phases, categories, configs
│   │   └── utils/
│   ├── science/              # Scientific protocol as code
│   │   ├── phases.ts
│   │   ├── scoring.ts
│   │   └── recommendations/
│   └── ui/                   # Shared UI components (future mobile)
│       └── components/
│
├── docker/
│   ├── docker-compose.yml    # Postgres + pgvector + MinIO (local dev)
│   └── Dockerfile.api        # API production build
│
├── turbo.json
├── package.json
├── tsconfig.base.json
└── .env.example              # Template without secrets
```

---

## 3. Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Monorepo | Turborepo | Smart caching, parallel builds |
| Web/PWA | React 19 + Vite 6 + Tailwind 4 | Performance, offline-first, installable |
| API | Fastify 5 + TypeScript | Faster than Express, native schema validation |
| ORM | Drizzle ORM | Type-safe, lightweight, SQL migrations |
| Auth | Better Auth | Session-based, 2FA, social login, brute-force protection |
| DB | PostgreSQL 16 + pgvector | Robust, encryption at rest, vector search |
| Storage | MinIO | S3-compatible, self-hosted |
| AI Coach | Anthropic Claude API (Sonnet 4.6) | Cost-effective for empathetic conversations |
| Crypto | Node.js crypto (built-in) | AES-256-GCM, HMAC-SHA256, zero extra deps |
| Validation | Zod | Shared schemas front/back |
| Edge | Cloudflare (free tier) | DDoS, WAF, CDN, SSL |
| Infra | Coolify on VPS | Docker orchestration, reverse proxy, auto-deploy |
| Dev local | Docker Compose | Postgres + pgvector + MinIO |
| Analytics | PostHog (self-hosted) | Privacy-first, never sends data to third parties |

---

## 4. Security Architecture (Fortress Layered)

Six independent layers. If one fails, the others hold.

### Layer 1 — Cloudflare (Edge)
- DDoS protection (free tier)
- WAF rules (blocks SQLi, XSS at edge)
- Server IP hidden
- SSL/TLS termination (Full Strict mode)
- Bot detection

### Layer 2 — Reverse Proxy (Traefik via Coolify)
- Internal TLS (Cloudflare → Traefik)
- Security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- Only accepts traffic from Cloudflare IPs (allowlist)
- No exposed ports besides 443

### Layer 3 — Fastify API
- `@fastify/helmet` — security headers
- `@fastify/cors` — strict origin (PWA domain only)
- `@fastify/rate-limit` — per IP + per user
- CSRF protection via double-submit cookie
- Input validation with Zod on ALL routes
- Request logging (audit trail)
- Error sanitization (never exposes stack traces)

### Layer 4 — Better Auth
- Session-based authentication (not JWT — instantly revocable)
- 2FA (TOTP) available
- Brute-force protection (lockout after N failed attempts)
- Argon2id for password hashing
- Anonymous sessions with upgrade to linked account
- Secure cookies (HttpOnly, SameSite=Strict, Secure)

### Layer 5 — Application Encryption
- AES-256-GCM for sensitive fields
- Encrypted fields: `urge_triggers`, `reflection`, `relapse_duration` context, `ai_sessions.messages`, `baseline_usage`, `current_goal`, `outcome`
- Envelope encryption: master key → data key per record
- Master key in environment variable (never in DB)
- Searchable fields maintain separate HMAC index for aggregation

### Layer 6 — PostgreSQL
- Binds to 127.0.0.1 / Docker internal network only
- Encryption at rest (filesystem level)
- Strong generated credentials (never defaults)
- Zero exposed ports — no external access
- Encrypted backups
- pgvector for collective knowledge base embeddings

---

## 5. Data Model

### 5.1 users
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  anonymous       BOOLEAN NOT NULL DEFAULT true,
  onboarding_done BOOLEAN NOT NULL DEFAULT false,
  current_phase   INT NOT NULL DEFAULT 1,
  streak_days     INT NOT NULL DEFAULT 0,
  last_check_in   TIMESTAMPTZ,
  timezone        TEXT
);
```

### 5.2 user_addictions
```sql
CREATE TABLE user_addictions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users ON DELETE CASCADE,
  category            TEXT NOT NULL,
  severity_score      INT NOT NULL,
  baseline_usage      BYTEA,                    -- encrypted JSON
  current_goal        BYTEA,                    -- encrypted JSON
  encrypted_data_key  BYTEA NOT NULL,           -- envelope encryption
  started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_category CHECK (category IN ('social_media','pornography','gaming','shopping')),
  CONSTRAINT valid_severity CHECK (severity_score BETWEEN 1 AND 10)
);
```

### 5.3 daily_checkins
```sql
CREATE TABLE daily_checkins (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users ON DELETE CASCADE,
  date                DATE NOT NULL,
  mood_score          INT NOT NULL,
  urge_level          INT NOT NULL,
  urge_triggers       BYTEA,                    -- encrypted TEXT[]
  urge_triggers_hmac  TEXT,                      -- HMAC for aggregate search
  healthy_activities  BYTEA,                    -- encrypted TEXT[]
  relapse             BOOLEAN NOT NULL DEFAULT false,
  relapse_duration    INT,
  reflection          BYTEA,                    -- encrypted TEXT
  encrypted_data_key  BYTEA NOT NULL,           -- envelope encryption
  phase               INT NOT NULL,

  CONSTRAINT valid_mood CHECK (mood_score BETWEEN 1 AND 5),
  CONSTRAINT valid_urge CHECK (urge_level BETWEEN 1 AND 10),
  UNIQUE(user_id, date)
);
```

### 5.4 restoration_log
```sql
CREATE TABLE restoration_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users ON DELETE CASCADE,
  date                DATE NOT NULL,
  exercise_minutes    INT DEFAULT 0,
  sleep_hours         FLOAT,
  meditation_minutes  INT DEFAULT 0,
  sunlight_minutes    INT DEFAULT 0,
  social_connection   BOOLEAN DEFAULT false,
  cold_exposure       BOOLEAN DEFAULT false,

  UNIQUE(user_id, date)
);
```

### 5.5 education_progress
```sql
CREATE TABLE education_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users ON DELETE CASCADE,
  lesson_id       TEXT NOT NULL,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  quiz_score      INT,

  UNIQUE(user_id, lesson_id)
);
```

### 5.6 ai_sessions
```sql
CREATE TABLE ai_sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users ON DELETE CASCADE,
  started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  context             TEXT NOT NULL,
  messages            BYTEA NOT NULL,           -- encrypted JSONB
  outcome             BYTEA,                    -- encrypted TEXT
  encrypted_data_key  BYTEA NOT NULL,           -- envelope encryption

  CONSTRAINT valid_context CHECK (context IN ('urge','checkin','education','crisis'))
);
```

### 5.7 collective_insights
```sql
CREATE TABLE collective_insights (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category        TEXT NOT NULL,
  insight_type    TEXT NOT NULL,
  content         TEXT NOT NULL,
  embedding       vector(1536),
  sample_size     INT NOT NULL,
  confidence      FLOAT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Encryption rules
- `BYTEA` fields = encrypted with AES-256-GCM at application layer
- `_hmac` fields = HMAC-SHA256 index for aggregate search without exposing values
- `encrypted_data_key` = per-record data key encrypted by master key (envelope encryption)
- Numeric fields (mood_score, urge_level, streak_days) remain plaintext for SQL aggregation — they don't identify users alone
- `ON DELETE CASCADE` everywhere — account deletion erases all data

---

## 6. Authentication Flows

### 6.1 Anonymous Start
1. User opens app → "Start anonymously"
2. Server creates user with `anonymous = true`
3. Session cookie set (HttpOnly, SameSite=Strict, Secure)
4. Full access to: check-in, AI Coach, education, dashboard
5. No access to: community, data backup
6. At any time: link email/social → `anonymous = false`, data preserved

### 6.2 Account Creation
1. Email/password (Argon2id hash) OR Social Login (Google/Apple)
2. Session created with secure cookie
3. 2FA (TOTP) offered during onboarding
4. If existing anonymous session: merge all data into new account

### 6.3 Account Deletion
1. User requests deletion → confirm with password or re-auth
2. `ON DELETE CASCADE` removes all data from all tables
3. All sessions revoked immediately
4. Backups expire on next retention cycle
5. Response: "Your data has been permanently deleted"

---

## 7. Field Encryption Flow

```
User submits check-in
  → Fastify validates with Zod (rejects malformed input)
  → Service generates random data key (256 bits)
  → Sensitive fields encrypted with data key (AES-256-GCM)
    → urge_triggers, reflection → BYTEA
    → urge_triggers → HMAC-SHA256 → urge_triggers_hmac
  → Data key encrypted with master key (envelope encryption)
    → Stored as encrypted_data_key (BYTEA)
  → Saved to PostgreSQL
    → mood_score, urge_level (plaintext, numeric, aggregatable)
    → sensitive fields (BYTEA, unreadable without master key)
```

---

## 8. Attack Protection Flow

```
Request arrives
  → Cloudflare: bot? DDoS? SQLi in URL? → BLOCKED
  → Traefik: IP not from Cloudflare? → REJECTED
  → Fastify rate-limit: > 100 req/min per IP? → 429 Too Many Requests
  → Fastify helmet + CORS: wrong origin? → REJECTED
  → Zod validation: invalid body/params? → 400 Bad Request (no internal details)
  → Better Auth: invalid/expired session? → 401 Unauthorized
  → Route executes with validated data and authenticated user ✓
```

---

## 9. Infrastructure (Coolify + VPS)

```
Internet → :443 (HTTPS) → Cloudflare → Traefik → Fastify API
                                                      ↓
                                          Docker internal network
                                                      ↓
                                    ┌─────────────────┼─────────────────┐
                                    │                 │                 │
                                PostgreSQL      MinIO           PostHog
                              (pgvector)    (S3 storage)    (analytics)
                              port: none    port: none      port: none
```

- All services on Docker internal network — zero exposed ports except 443
- Coolify manages containers, auto-deploy via git push
- Traefik (bundled with Coolify) handles TLS and reverse proxy
- Only Fastify API is reachable from Traefik — DB, MinIO, PostHog are internal only

---

## 10. Out of Scope (Sprint 0)

- Mobile app (React Native) — planned for later
- Community features — Phase 3
- Push notifications — Sprint 2
- AI Coach implementation — Sprint 3
- PostHog setup — after core is stable
- MinIO setup — when file uploads are needed

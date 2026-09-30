# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aletheia is a crowd-sourced fact-checking platform for analyzing public figure statements and combating fake news. The application uses a hybrid architecture with:
- **Backend**: NestJS (Node.js framework) with MongoDB
- **Frontend**: Next.js with React and Material-UI
- **Authentication**: Ory Kratos with CASL-based RBAC
- **Real-time**: WebSocket support for collaborative editing via Yjs
- **Feature Flags**: Unleash (via nestjs-unleash)

## Essential Commands

### Development
```bash
yarn install              # Install dependencies
yarn dev                  # Start dev server (backend + frontend)
yarn debug                # Start with Node Inspector
yarn build-ts             # Type check (run before commits)
yarn lint                 # Lint code
yarn lint:fix             # Fix linting issues
```

### Building
```bash
yarn build                # Full production build
yarn build-ts             # TypeScript type checking only (noEmit)
yarn build-nest           # NestJS backend build → dist/
yarn build-next           # Next.js frontend build → .next/
```

### Database
```bash
yarn seed                 # Seed database with initial data
yarn migrate              # Run pending migrations
yarn migrate:create <name> # Create new migration
yarn migrate:status       # Check migration status
```

### Testing
```bash
yarn test                 # Run all tests (unit + e2e)
yarn test path/to/file    # Run specific test
yarn test:e2e:cy          # Run Cypress e2e tests
yarn cypress-open         # Open Cypress interactive runner
```

## Architecture Overview

### Backend Structure (server/)
NestJS modular architecture. All modules registered in `server/app.module.ts`.

**Core Business Modules**:
- `claim/` — Claims with content types: sentences (speeches), images, debates. Includes `claim-revision/` for versioning and `parser/` for content parsing
- `claim-review/` — Fact-checking reviews and classification workflow
- `verification-request/` — Verification request intake and triage (includes state machine)
- `review-task/` — Review task assignments, drafts, and state management. Includes `comment/` for review annotations
- `personality/` — Public figures (MongoDB implementation in `mongo/` subdirectory)
- `users/` — User management, profiles, and role updates
- `source/` — Source/reference management for claims and reviews
- `topic/` — Topic categorization with Wikidata integration

**Auth & Security**:
- `auth/` — Ory Kratos integration, guards, CASL abilities, namespace access control
- `captcha/` — Google reCAPTCHA validation

**AI & Automation**:
- `ai-task/` — AI task processing
- `automated-fact-checking/` — Automated fact-checking pipeline
- `copilot/` — AI assistant (chat service)
- `summarization/` — Content summarization

**Infrastructure**:
- `events/` — Events system with metrics
- `notifications/` — Notification system (Novu)
- `feature-flag/` — Unleash feature flag service
- `file-management/` — AWS S3 file uploads
- `search/` — MongoDB Atlas Search
- `editor/` — Collaborative editor state
- `editor-parse/` — Editor content parsing to HTML
- `yjs-websocket/` — Yjs WebSocket server for real-time collaboration
- `history/` — Audit trail for entity changes
- `state-event/` — State transition tracking
- `tracking/` — User/event tracking
- `management/` — Cascade delete and entity management
- `daily-report/` — Automated daily reports
- `badge/` — User badge system
- `group/` — Content grouping
- `stats/` — Analytics and statistics
- `wikidata/` — Wikidata API integration
- `chat-bot/` and `chat-bot-state/` — Chatbot module

### Frontend Structure (src/)

**Pages** (`src/pages/`): Next.js SSR pages. Most pages receive props from NestJS controllers via `getServerSideProps` parsing `query.props`.

**Core Components** (`src/components/`):
- `Claim/` — Claim display, creation (speech, image, debate, unattributed)
- `ClaimReview/` — Review interface with `form/DynamicReviewTaskForm.tsx` (main review form, ~490 lines)
- `VerificationRequest/` — Verification request board, cards, forms, detail drawer
- `Personality/` — Personality profiles and cards
- `Collaborative/` — Real-time collaborative editing (Remirror + Yjs)
- `Editor/` — Review editor with auto-save
- `Copilot/` — AI assistant drawer
- `Modal/` — Shared modals including `RecaptchaModal`
- `adminArea/` — Admin interface components
- `Dashboard/` — Admin dashboard
- `Home/` — Homepage components
- `Search/` — Search with overlay results
- `Event/` — Events feature components

**State Management** (3 systems):
- **Redux** (`src/store/`): UI state — sitekey, drawer states, search results, viewport breakpoints. Actions in `store/actions.ts`, types in `store/types.ts`
- **Jotai** (`src/atoms/`): Atomic state — `currentUser.ts` (role, auth status), `namespace.ts`, `featureFlags.ts`, `debate.ts`, `badges.ts`
- **XState** (`src/machines/`): Complex workflows — `reviewTask/` (review state machine with permissions), `createClaim/`, `callbackTimer/`

**API Layer** (`src/api/`): Each module has its own Axios instance with `withCredentials: true`. Error messages shown via `MessageManager`. Key files: `claim.ts`, `claimReviewApi.ts`, `reviewTaskApi.ts`, `verificationRequestApi.ts`, `personality.ts`, `sourceApi.ts`, `userApi.ts`.

## Auth System

### Guards (applied globally via `SessionGuard`)
- `SessionGuard` — Global guard, validates Ory session. Routes marked `@Public()` bypass it
- `AbilitiesGuard` — Checks CASL abilities for role-based access
- `M2MGuard` — Validates M2M (machine-to-machine) OAuth2 tokens
- `SessionOrM2MGuard` — Accepts either session or M2M auth
- `NameSpaceGuard` — Validates user access to specific namespaces

### Unified Auth Decorators (`server/auth/decorators/auth.decorator.ts`)
Use these instead of manual `@UseGuards()`:
```typescript
@Public()                              // No auth required
@Auth()                                // Any authenticated user (session or M2M)
@AdminOnly()                           // Admin role, session only
@AdminOnly({ allowM2M: true })         // Admin role, session or M2M
@FactCheckerOnly()                     // Fact-checker/reviewer role
@RegularUserOnly()                     // Regular user role
```

See `server/auth/AUTH_DECORATOR_MIGRATION.md` for full migration guide.

### Roles (`server/auth/ability/ability.factory.ts`)
```
Regular      — read only
FactChecker  — read, create, update
Reviewer     — read, create, update
Admin        — manage all
SuperAdmin   — manage all, not editable
Integration  — M2M create access
```

## Permission System

Centralized RBAC for review workflows:
- **Location**: `src/machines/reviewTask/permissions.ts`
- **Hook**: `useReviewTaskPermissions()` in `src/machines/reviewTask/usePermissions.ts`
- **Workflow states**: `unassigned` → `assigned` → `reported` → `reviewing/crossChecking` → `published`
- **Permission types**: `canAccessState`, `canViewEditor`, `canEditEditor`, `canSubmitActions`, `canSelectUsers`, `showForm`, `canSaveDraft`

## Feature Flags (Unleash)

Managed via `server/feature-flag/feature-flag.service.ts`. Returns `false` when Unleash is not configured.

Active flags:
- `enable_collaborative_editor` — Real-time collaborative editing
- `copilot_chat_bot` — AI copilot chat
- `enable_events_feature` — Events system
- `enable_editor_annotations` — Editor annotation support
- `enable_reviewers_update_report` — Allow reviewers to update reports
- `enable_view_report_preview` — Report preview feature

## Captcha Provider

Captcha verification is pluggable via `server/captcha/`: a `CaptchaProvider`
interface + `CAPTCHA_PROVIDER` DI token, selected by `captcha.provider` config
(`recaptcha` default, or `none` to disable captcha entirely). All existing
`captchaService.validate(token)` call sites and the ~20 SSR sitekey-injection
sites are unaffected by provider choice. See
`server/captcha/WRITING-A-PROVIDER.md` for adding an open provider (ALTCHA is
provided as a build-excluded `.example.ts(x)` reference, not a dependency).

## Key Technical Details

1. **TypeScript**: `strict: false` in root `tsconfig.json`. Three configs: root (type-check only, `noEmit: true`), `server/tsconfig.json` (backend build), `src/tsconfig.json` (frontend)

2. **Internationalization**: next-i18next with `pt` and `en` locales in `public/locales/`

3. **Sitekey flow**: reCAPTCHA sitekey is passed from NestJS page controllers → Next.js `pageProps` → Redux store (`actions.setSitekey()`) → `AletheiaCaptcha` component reads via `useAppSelector`

4. **Soft deletes**: Uses `mongoose-softdelete-typescript`. Models have `isDeleted` field and `softDelete()` method

5. **Namespaces**: Multi-tenant via namespace slugs in URL (`:namespace?` controller prefix). `NameSpaceEnum.Main` is default

6. **File Uploads**: AWS S3 (LocalStack for local dev)

7. **Email**: Nodemailer with Handlebars templates

8. **Analytics**: Umami v2 (configured via `NEXT_PUBLIC_UMAMI_SITE_ID`)

9. **ESLint**: Uses flat config (`eslint.config.mjs`, ESLint v9+)

10. **Postgres migration (in progress)**: MongoDB → Postgres, module by module behind a `DB_TYPE` boot switch. Before touching any `<module>/postgres/`, `server/database/postgres/`, or `migrations-postgres/` code, read `docs/postgres-migration-foundation.md` — it is the single source of truth for the architecture decisions, the per-module porting recipe, and the ship gates. To port a module, invoke the `pg-migrate-module` skill (`.claude/skills/pg-migrate-module/`)

11. **LLM / Embeddings Providers**: AI features (copilot, summarization, verification-request embeddings) use injectable `LLMProvider` / `EmbeddingsProvider` abstractions (`server/llm/`, DI tokens `LLM_PROVIDER` / `EMBEDDINGS_PROVIDER`, bound by the global `LlmModule`). The default implementations target any OpenAI-compatible endpoint. Configure via the `llm` block in `config.yaml` (`api_key`, optional `base_url`, `chat_model`, `temperature`, `embeddings_model`); `api_key` falls back to `openai.api_key` then `OPENAI_API_KEY`. Point `llm.base_url` at a self-hosted/open-weight server (Ollama, vLLM, LocalAI, Azure) to swap providers with no code change; when no key is configured, a placeholder API key is supplied automatically for keyless local servers. Leave `embeddings_model` unset to preserve stored-vector compatibility. See `server/llm/USING-A-LOCAL-PROVIDER.md` for an Ollama setup example.

## Development Setup

1. Copy config files:
   - `cp config/localConfig.example.ts config/localConfig.ts`
   - `cp config.example.yaml config.yaml`
2. Start infrastructure: `docker-compose up` (MongoDB, Ory Kratos, Mailslurper, LocalStack)
3. Install dependencies: `yarn install`
4. Run migrations: `yarn migrate`
5. Seed database: `yarn seed`
6. Start dev server: `yarn dev`

### Docker Compose Services
- MongoDB (primary database)
- Ory Kratos (identity/auth) + Kratos self-service UI
- Mailslurper (SMTP testing)
- LocalStack (S3/IAM emulation)
- FerretDB + PostgreSQL (MongoDB alternative for testing)

## Common Patterns

1. **API Routes**: RESTful with NestJS decorators. Use `@Auth()` decorators for access control
2. **Page Rendering**: NestJS controllers use `ViewService.render()` to pass data to Next.js pages via query params
3. **Component Structure**: Functional components with hooks. Material-UI for styling
4. **Validation**: Zod 4 only, for all new code. See **Validation (Zod)** below.
5. **Error Handling**: Global `AllExceptionsFilter` in NestJS. Frontend uses `MessageManager` for toast messages
6. **Testing**: Vitest for unit/e2e (server), Cypress for browser e2e. E2E tests use mongodb-memory-server with per-worker DB isolation via `server/tests/globalSetup.ts` (provides `mongoBaseUri`) and `server/tests/per-worker-setup.ts` (assigns each Vitest worker its own database). Globals mode is enabled — use `vi.fn()`, `vi.mock()`, etc.

## Validation (Zod)

Zod 4 (`import { z } from "zod"`, single copy shared with LangChain). Do NOT add `nestjs-zod` or new class-validator DTOs; the legacy class-validator DTOs (30 files) get migrated when their module is touched.

**Where things live**
- `lib/schemas/` holds isomorphic primitives: `objectId`, `dataHash`, `wikidataId`, `nonEmptyText(max)`, `email`, `captchaToken`, `isoDateTime`, `queryInt`, `pageQuery`, `pageSizeQuery(max)`, `queryBoolean`, `legacyQueryFlag`, `queryArray(item)`, `sortOrder`. No imports from Nest/mongoose/drizzle/react/`server`/`src`, so the frontend can import them. Only add a primitive for a rule that already exists in the codebase, with a spec.
- `server/common/validation/` holds the Nest glue: `ZodBody`, `ZodQuery`, `ZodParam`, `ZodValidationPipe`, `ZodValidationException`.
- `server/<module>/dto/*.dto.ts` holds module schemas. Promote one to `lib/schemas/` when the frontend needs the same contract.

**Endpoint pattern**
```ts
export const CreateFooSchema = z.strictObject({ title: nonEmptyText(200), personality: objectId, kind: z.enum(FooKind) });
export type CreateFooDto = z.output<typeof CreateFooSchema>;

create(@ZodBody(CreateFooSchema) body: CreateFooDto) {}
list(@ZodQuery(ListFooQuery) query: ListFooQueryDto) {}   // z.object (strip), coercing fields
get(@ZodParam("id", objectId) id: string) {}
```

**Rules**
- **Wire every schema.** `@Body() x: ZodInferredType` with no Zod pipe is silently unvalidated: the global class-validator `ValidationPipe` only checks classes. The ratchet `server/common/validation/validation-coverage.spec.ts` fails CI on any new unvalidated `@Body`/`@Query`/`@Param`. Its baseline (`validation-coverage.baseline.json`) can only shrink, so delete a line when you fix it. It can't see `@Req() req.body` reads.
- **Never combine** a class DTO type with a `Zod*` decorator; both pipes would run.
- **Bodies use `z.strictObject`.** This keeps the global pipe's `forbidNonWhitelisted` behaviour. **Queries use `z.object`** (strip), so cache-busters don't 400, unless you're porting a class DTO, which was strict. **Upstream/vendor payloads use `z.object`.**
- **Query values** are `string | string[] | object`. Always coerce (`queryInt`, `queryArray`, `queryBoolean`) and bound page sizes. A raw `@Query() q: any` that reaches a Mongo filter is a NoSQL operator-injection risk (`?x[$ne]=`).
- **Use v4 APIs:** `z.strictObject`, `z.enum(TsEnum)` (not `nativeEnum`), `z.email()` / `z.url()` / `z.iso.datetime()`, `{ error: "msg" }`, `err.issues` / `z.flattenError`, `z.ZodType`, `.extend()`, `z.record(z.string(), V)`.
- **Parse, don't cast.** Use `safeParse` at boundaries. No `schema.parse(x) as T`, no `z.any()` (use `z.unknown()`), no `as any` on schemas handed to libraries. Compose schemas; don't wrap `.parse()` in a `.refine` try/catch. Every `JSON.parse` of external text is followed by a `safeParse`.
- **Porting a class-validator DTO means keeping the same accepted inputs.** Call out any tightening in the PR. Watch for: undecorated props, which were stripped before and are rejected by `strictObject`; `@Transform` booleans, which map to `legacyQueryFlag`; `PartialType`, which maps to `.partial()`; `validator.isURL`, which differs from `z.url()`.
- **LLM tool schemas:** Zod 4 marks `.default()` fields as *required* in the JSON Schema sent to the model. Use `.optional()` and apply the default in the handler.
- **Errors:** a Zod failure returns 400 with `message: { message: "Validation failed", target, issues: [{ path, code, message }] }` inside the `AllExceptionsFilter` envelope. Non-Zod errors thrown inside a transform or refinement stay 500s.
- **Swagger** is generated from the schema by the decorators. Use `.meta({ description })`; don't add a manual `@ApiBody`, because it overrides the generated schema.
- **Branded types** (`.brand()`) are deferred until the class-validator migration is done.
- **Tests:** add at least one 400 case per new schema.

**Known gaps not covered by the ratchet:** `chat-bot` webhook `req.body`; `automated-fact-checking` NDJSON `JSON.parse`; `callback-dispatcher` result `z.any()`; LLM outputs (summarization, copilot); Wikidata/Ory/reCAPTCHA responses; `config.yaml`/env and `config/localConfig.schema.ts`, which are not parsed at boot; the frontend (`query.props` in SSR pages, `src/api/*` responses, `react-hook-form` needs ≥ 7.55 for `@hookform/resolvers/zod`).

## Important Files

- `config.yaml` — Main config (copy from `config.example.yaml`)
- `config/localConfig.ts` — Local overrides (copy from `config/localConfig.example.ts`)
- `server/app.module.ts` — Backend module registration
- `src/pages/_app.tsx` — Next.js app initialization
- `src/store/store.ts` — Redux store with all reducers
- `src/atoms/` — Jotai atoms (currentUser, namespace, featureFlags)
- `server/auth/decorators/auth.decorator.ts` — Unified auth decorators
- `server/auth/ability/ability.factory.ts` — CASL role definitions
- `server/feature-flag/feature-flag.service.ts` — Feature flag service
- `migrate-mongo-config.ts` — Migration configuration
- `migrations/` — 54+ database migrations

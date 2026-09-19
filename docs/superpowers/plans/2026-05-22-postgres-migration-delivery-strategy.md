# Postgres Migration — Delivery & Shippability Strategy

**Date:** 2026-05-22
**Status:** Draft
**Base:** [`2026-05-10-postgres-completion-checklist.md`](../specs/2026-05-10-postgres-completion-checklist.md) (WHAT modules, WHICH order)
**This doc:** HOW to ship each phase safely, reversibly, in production, without a big-bang cutover.

> The completion checklist answers *which modules get ported in what order* (Phases 0–11).
> This document answers *how each of those phases reaches production without breaking the live app* —
> the ship gates, cutover mechanics, data-parity verification, and rollback that make the migration safe.
> Read them together. Where they conflict, this doc wins on delivery mechanics; the checklist wins on module scope.

---

## 0. Guiding principles

1. **Every phase is independently shippable and independently revertible.** No phase depends on a later phase being deployed. A phase can sit in production for weeks before the next lands.
2. **`DB_TYPE` is a boot-time switch, never a runtime one.** One backend per process. This is already the design (`server/config/db.config.ts`). We do NOT introduce per-request routing.
3. **Ship the *code path* dark before you ship the *data*.** A ported module reaches `main` and prod on `DB_TYPE=mongodb` (dormant Postgres impl, never executed) long before any prod deployment flips to Postgres. Merging ≠ cutting over.
4. **Correctness is proven by equivalence, not by hope.** Contract tests + a shadow-read parity harness prove the Postgres impl returns the same answers as Mongo *on real data* before any cutover.
5. **No silent scope reduction.** If a query is deferred (`NotImplementedError`), it is visible (HTTP 501) and tracked in the checklist. Never a silent empty result.

---

## 1. Two cutover strategies — pick per deployment

The checklist (Phase 10) assumes **downtime is acceptable** → simplest path. That is correct for a single-tenant / greenfield deploy. For multi-tenant prod, offer the zero-downtime path too. Decide **per deployment**, not globally.

### Strategy A — Downtime cutover (default, matches checklist Phase 10)

```
freeze writes → pg_dump-equivalent export from Mongo → run migration scripts →
verify row counts + parity sample → flip DB_TYPE=postgres → boot → smoke test → unfreeze
```

- **Pro:** simplest, no dual-write code, no drift window.
- **Con:** maintenance window (minutes-to-hours depending on collection sizes).
- **Rollback:** flip `DB_TYPE=mongodb`, reboot. Mongo data untouched. < 5 min.

### Strategy B — Expand/Contract zero-downtime (recommended for prod with SLA)

The industry-standard safe pattern. Four stages, each reversible:

```
EXPAND   1. Deploy Postgres schema alongside Mongo (both live, Mongo authoritative).
         2. Enable DUAL-WRITE: writes go to Mongo (authoritative) AND Postgres (best-effort, async, logged-on-fail).
BACKFILL 3. Run idempotent backfill to copy historical Mongo → Postgres. Re-runnable.
VERIFY   4. Shadow-read: every read hits Mongo (served) + Postgres (compared, diff logged). Drive diff rate → 0.
CUTOVER  5. Flip authoritative reads to Postgres (Mongo still dual-written as fallback).
CONTRACT 6. After observation window with zero diffs, stop writing Mongo. Later: sunset (checklist Phase 11).
```

- **Pro:** zero downtime, continuous rollback (revert authoritative flag at any stage).
- **Con:** requires a dual-write shim + shadow-read harness (built once, reused every phase).
- **Rollback:** at any stage, point `authoritative` back to Mongo. Postgres writes were best-effort; discarding them loses nothing.

> **Recommendation:** Build the Strategy-B harness (dual-write shim + shadow-read differ) as a **cross-cutting deliverable during Phase 1**, then reuse it for every subsequent phase. It is the single highest-leverage investment in the whole migration. Deployments that don't need zero-downtime just skip enabling it and use Strategy A.

---

## 2. Per-phase ship gate (Definition of Done to merge + deploy dark)

A phase MAY merge to `stage`/`main` and ride to prod (dormant, `DB_TYPE=mongodb`) only when ALL are true. This is the checklist's "universal per-phase requirements" **plus** the delivery gates:

**From the checklist (functional completeness):**
- [ ] `I<Module>Service` interface captures full public surface.
- [ ] `<module>/postgres/` sibling implements it; Drizzle schema registered in `schema/index.ts`.
- [ ] Drizzle-kit migration in `migrations-postgres/`.
- [ ] `<module>.service.type-test.ts` compile-time exact-surface gate.
- [ ] `<module>.module.ts` + `.provider.ts` have the `postgres` branch.
- [ ] Contract tests (`<module>-contract.spec.ts`) pass on BOTH backends.
- [ ] `NotImplementedError`s this phase is declared to unblock are removed.

**Added delivery gates (this doc):**
- [ ] **CI runs the module's suite under BOTH `DB_TYPE=mongodb` and `DB_TYPE=postgres`** (pglite). No new red on either.
- [ ] **Parity harness green for this module** on a representative dataset (see §3): diff rate = 0 on the contract corpus.
- [ ] **Rollback rehearsed** in staging: flip to Postgres, exercise module, flip back — no data loss, no boot error.
- [ ] **Perf budget met** (see §4): no ported query slower than the Mongo baseline by > agreed threshold on the staging dataset, `EXPLAIN` captured for every non-trivial query.
- [ ] **Observability wired**: per-method latency + error metrics emitted for the new Postgres impl (Nest interceptor, cross-cutting — built once).
- [ ] **Dependency check**: every FK this module needs points at a table already in Postgres (see §5 graph). If not, the dependency table is ported (at least schema + enough surface to satisfy the join) in the same phase.

> Merging with all boxes checked puts the code in prod **dark**. Flipping a deployment to `DB_TYPE=postgres` is a **separate, later decision** gated on §6.

---

## 3. Data-parity verification harness (the correctness backbone)

Contract tests prove behavior on *synthetic* fixtures. They do NOT prove the Postgres impl matches Mongo on *your production data's* edge cases (nulls, legacy shapes, unicode, orphaned refs). The parity harness closes that gap.

**Two modes, same differ core:**

- **Offline (Strategy A & pre-cutover):** a script reads N records per collection from a Mongo snapshot, runs the same logical query through both `Mongo<Module>Service` and `Postgres<Module>Service`, deep-diffs the results, reports diff rate + samples. Run in CI against a fixture snapshot; run manually against a prod snapshot before any cutover.
- **Online shadow-read (Strategy B):** in the live app, reads are served from the authoritative backend and *also* issued against the shadow backend on a sampled % of requests; diffs are logged (never served). Drive the diff rate to zero over the observation window.

**Differ rules (must be codified, not ad hoc):**
- `ObjectId` ↔ UUID mapping is deterministic (uuid v5 in a fixed namespace — checklist Phase 10) so cross-references compare equal.
- Field-ordering, `Date` precision (Mongo ms vs PG `timestamptz` µs), and `Decimal128` ↔ `numeric` are normalized before compare.
- Fuzzy/vector queries compare **result-set membership + ranking within tolerance**, not exact scores (`pg_trgm` similarity ≠ Atlas score; `pgvector` cosine ≠ Atlas vector score). Define the tolerance per query in the phase spec.

**Deliverable:** `scripts/parity/` — differ core + per-module query registry. Built in Phase 1, extended one entry per phase.

---

## 4. Performance gates

Mongo Atlas aggregations that become SQL can regress silently. Every phase that ports a non-CRUD query MUST:

- [ ] Capture `EXPLAIN (ANALYZE, BUFFERS)` for each ported query, committed alongside the phase (`docs/.../<phase>-explain.md`).
- [ ] Confirm the intended index is used (GIN for `pg_trgm`, HNSW/IVFFlat for `pgvector`, btree for FKs/sorts). A seq-scan on a large table fails the gate.
- [ ] Compare p50/p95 against the Mongo baseline on the staging dataset. Regression > agreed threshold (start at 1.5×) is a blocker unless explicitly waived in the spec.
- [ ] For the aggregation-heavy modules (checklist Phase 7: `events`, `stats`, `daily-report`, `verification-request-stats`) evaluate **materialized views** refreshed on a schedule vs live CTEs. Decide per query.

**Index strategy decisions to pin (once, reused):**
- `pg_trgm`: GIN index + similarity threshold via config (`db.postgres.fuzzy_threshold`, already scaffolded). Threshold validated per corpus.
- `pgvector`: **HNSW** default (query-latency optimized) — checklist Phase 1 decision. Switch to IVFFlat only if write throughput dominates. Pin embedding dimension in schema (confirm canonical model; `text-embedding-3-small` = 1536).


---

## 5. Module dependency graph (drives phase ordering)

Foreign keys dictate what must exist before what. The checklist's business-value ordering (verification-request early) creates a tension: it references tables owned by later phases. Resolve by **porting dependency tables' schema (not necessarily full service) in the same PR**.

```
External (not ported): Ory Kratos identity · Wikidata API · S3 · Novu · OpenAI

Leaf tables (no internal FK) ── port schema first, cheap:
  source · topic · group · badge · impact_area

personality ──▶ (wikidata external)                         [Phase 0 ✅]
claim ──▶ personality                                        [Phase 2]
claim_revision ──▶ claim                                     [Phase 2]
claim (types: sentence/image/debate/unattributed)            [Phase 2]
claim_review ──▶ claim, claim_revision, personality, source  [Phase 3]
verification_request ──▶ source, group, topic, (pgvector)    [Phase 1] ⚠ needs leaf tables early
users ──▶ (kratos external), badge                           [Phase 4]
review_task ──▶ claim_review, users ; comment ──▶ review_task [Phase 5]
history · state_event · tracking ──▶ (polymorphic refs)      [Phase 6]
events · stats · daily_report ──▶ read-only over all above   [Phase 7]
ai_task · copilot · summarization · automated_fact_checking  [Phase 8] (share pgvector w/ Phase 1)
editor · editor_parse · yjs_websocket (CRDT blobs → bytea)   [Phase 9]
report · management · callback_dispatcher                    ⚠ see §7 gaps
```

⚠ **Ordering rule:** before Phase 1 (verification-request) can *cut over*, the leaf tables it joins (`source`, `topic`, `group`) need schema + read surface in Postgres. Either pull those into Phase 1's PR (schema-only, service stubbed) or move a slim "leaf tables" phase ahead of Phase 1. **Recommend:** a **Phase 0.5 — leaf tables** (schema + basic CRUD for `source`, `topic`, `group`, `badge`) so Phases 1–5 all have their join targets present. Cheap (S), unblocks everything.

---

## 6. Cutover decision gate (flipping a deployment to `DB_TYPE=postgres`)

Separate from merging. A deployment flips only when:

- [ ] **All modules that deployment uses** are ported and past their ship gate (§2). Partial cutover is NOT supported — one process, one backend.
- [ ] Parity harness (§3) diff rate = 0 over the observation window on that deployment's real data.
- [ ] Backfill (Strategy B) or export/import (Strategy A) row counts reconciled per table.
- [ ] Perf gates (§4) green on production-representative load.
- [ ] Rollback rehearsed on a staging clone of that deployment.
- [ ] Runbook exists: pre-flight checks, downtime estimate (Strategy A) or dual-write drift monitoring (Strategy B), and the one-command rollback.

Because the personality slice is the only fully-ported module until Phase 3+ completes, **the first real cutover-eligible milestone is after Phase 3** (personality has zero `NotImplementedError`s only after claim + claim-review land). Track cutover-readiness as a checklist milestone, not per-phase.

---

## 7. Gaps to resolve before finalizing the phase list

Modules found in the codebase that the checklist does NOT explicitly place (audit follow-up):

- **`report`** — has a mongoose model; not named in any phase. Slot into Phase 3 (review-adjacent) or Phase 6.
- **`management`** (cascade-delete/entity mgmt) — cross-cutting; its cascade logic must be re-expressed as SQL FK `ON DELETE` rules or explicit transactional deletes. Call out in the phase that owns each cascaded entity.
- **`callback-dispatcher`, `chat-bot`, `chat-bot-state`** — confirm DB footprint; likely Phase 8 (thin DB layers).
- **`search`** — Atlas Search is used by `claim` + `personality`. Confirm no standalone `search` collection; if it's purely query-layer it needs no port, only the `pg_trgm`/`$search` rewrites already tracked per module.

**Action:** a short audit spec resolving these before Phase 1 starts, so the phase list is exhaustive.

---

## 8. Cross-cutting deliverables (built once, reused every phase)

| Deliverable | Built in | Reused by |
|---|---|---|
| `NotImplementedError` → HTTP 501 mapping | Phase 0 ✅ | all |
| Type-test gate pattern | Phase 0 ✅ | all |
| pglite dual-backend CI | Phase 0 ✅ | all |
| **Parity differ core** (`scripts/parity/`) | Phase 1 | all cutovers |
| **Dual-write shim + shadow-read** (Strategy B) | Phase 1 | all zero-downtime cutovers |
| **Per-method latency/error interceptor** | Phase 1 | all perf/obs gates |
| **`legacy_object_id` migration column** convention | Phase 10 | migration + rollback |
| **Backfill driver** (`yarn migrate:to-postgres`, dependency-ordered, idempotent) | Phase 10 | all cutovers |
| Connection-pool sizing + exhaustion monitoring | Phase 0 ✅ (extend) | all |

---

## 9. Sequenced roadmap (delivery view)

```
✅ Phase 0    Foundation + personality (MERGED, dark)         PR #2459
   Phase 0.5  Leaf tables: source/topic/group/badge (schema+CRUD)   [S]  ← NEW, unblocks joins
   Phase 1    verification-request + pgvector + PARITY HARNESS       [M]  ← builds cross-cutting tooling
   Phase 2    claim + claim-revision + content types                [L]  → unblocks personality cross-methods
   Phase 3    claim-review                                          [M]  → personality = zero 501s ★ first cutover-eligible
   ── CUTOVER MILESTONE A: deployments using only {personality,claim,claim-review,VR} can flip ──
   Phase 4    users + roles/badges                                  [M]
   Phase 5    review-task + comment                                 [M]
   Phase 6    source/topic/group/badge/history/state-event/tracking [M]  (leaf svc surfaces completed)
   Phase 7    events/stats/daily-report/vr-stats (aggregations)     [L]  ← perf gates critical
   Phase 8    ai-task/copilot/summarization/AFC/chat-bot/files      [M]
   Phase 9    editor/collaborative/yjs (CRDT → bytea)               [L]  ← highest uncertainty
   ── CUTOVER MILESTONE B: full parity — all deployments flippable ──
   Phase 10   migration tooling + backfill + legacy_object_id       [M]
   Phase 11   sunset MongoDB                                        [S]
```

**Timeline:** ~6–9 months solo (per checklist), less with Phase 1 ‖ Phase 2 parallelism once Phase 0.5 lands. Phases 6–8 batchable. Phase 9 carries the schedule risk.

---

## 10. Risk register

| Risk | Phase | Mitigation |
|---|---|---|
| Aggregation SQL slower than Atlas | 7 | `EXPLAIN` gate §4; materialized views; perf regression blocker |
| Fuzzy/vector ranking differs from Atlas | 1,2 | tolerance-based parity compare §3; corpus validation of thresholds |
| Yjs CRDT persistence awkward in PG | 9 | `bytea` blob first; hybrid-retain Mongo for Yjs only as last resort (decide in Phase 9 spec) |
| Cascade-delete semantics lost | 6 | audit `management/`; re-express as FK `ON DELETE` or transactional deletes §7 |
| Dual-write drift (Strategy B) | 1+ | shadow-read diff monitoring; authoritative-Mongo fallback until diff=0 |
| Node version split (CI 20.18 vs 22) | 0 | already flagged in PR #2459; bump remaining CI jobs as follow-up |
| Partial-cutover attempted | cutover | hard gate §6: all-modules-or-nothing per process |
| Connection-pool exhaustion as modules grow | all | single shared pool + exhaustion metrics §8 |

---

## When this strategy is satisfied

Every phase shipped dark, cut over per §6, parity-verified, reversible at each step, and Phase 11 removes Mongo — with no big-bang, no unverified cutover, and a rehearsed rollback at every milestone.

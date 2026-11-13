# Copilot Partial-Failure Disclosure (Gap A) — Design

**Date:** 2026-07-04
**Repo:** aletheia
**Scope:** Aletheia copilot — disclose when one of multiple requested fact-check searches fails, instead of silently presenting only the surviving search.

## Problem

When a fact-checker asks the copilot to run "ambos" (both online + public-gazette searches), the tool-calling agent invokes the `get-fact-checking-report` tool twice within a single `agentChat` run — once per `searchType`, because the tool's `searchType` field is a single-value enum (`online | gazettes`), with no "both" value.

If one leg fails (e.g. the Agência online pipeline errors with `No module named 'bs4'`) and the other completes, the copilot presents **only** the surviving leg and never discloses the failure. The user asked for two searches; one silently died; the response — and the persisted transcript — read as if the full plan was carried out.

### Root cause (two independent defects)

1. **The tool swallows the failure into a free-text observation.**
   `server/copilot/copilot-chat.service.ts` — the tool `func` `catch` block does `return String(error)`, turning a failed leg into just another tool observation handed back to the LLM.

2. **Nothing forces disclosure.**
   The final user-facing message is `response.output`, composed freely by the LLM. The system prompt never instructs it to report a failed search, so it optimizes for a clean answer and omits the failed leg. Disclosure of a trust-critical event rides entirely on unguaranteed LLM behavior.

The frontend renders the assistant `content` as plain text (`src/components/Copilot/CopilotConversationCard.tsx`), so a server-composed disclosure line in `response.output` fully covers the fix — no frontend change required.

## Approach (chosen: C — deterministic disclosure)

Make disclosure a **guarantee in code**, not a hope in the prompt. Track each tool invocation's outcome in a shared ref (reusing the existing `editorReportRef` / `executionIdRef` pattern already in the service), then deterministically prepend a user-safe disclosure block to the LLM output after the agent run.

Rejected alternatives:
- **A — Prompt-only:** the trust-critical guarantee would ride on LLM compliance, and omitting the failure is exactly the LLM behavior we are trying to stop.
- **B — Structured tool result + prompt:** better signal, but disclosure is still LLM-rendered → still probabilistic.

## Design

### 1. New unit — `server/copilot/copilot-disclosure.util.ts`

A pure, dependency-free, independently-testable module. The `SearchType` enum is **relocated here** from `copilot-chat.service.ts` so the util stays self-contained and the service imports the type from the util (one-way dependency: service → util).

```ts
export enum SearchType {
    online = "online",
    gazettes = "gazettes",
}

export type SearchStatus = "ok" | "failed";

export interface SearchOutcome {
    searchType: SearchType;
    status: SearchStatus;
}

/**
 * Collapse repeated calls per searchType (last-write-wins), so an LLM retry
 * of a failed leg that later succeeds does not leave a false "failed" outcome.
 */
export function summarizeOutcomes(outcomes: SearchOutcome[]): SearchOutcome[];

/**
 * "" when nothing failed; otherwise a user-safe, localized disclosure block.
 * Never contains raw error text or tracebacks.
 */
export function buildFailureDisclosure(
    outcomes: SearchOutcome[],
    language: string
): string;

/**
 * Prepend the disclosure block to the LLM output.
 * Returns output unchanged when no leg failed.
 */
export function applyFailureDisclosure(
    output: string,
    outcomes: SearchOutcome[],
    language: string
): string;
```

**Disclosure content:**
- Names the failed leg(s) in the user's language: `online` → "busca online"; `gazettes` → "busca nos diários oficiais" (en: "online search" / "public gazette search").
- When at least one leg also **succeeded**, adds the "segue apenas o resultado de X" framing and a retry offer ("Deseja tentar a busca online novamente?").
- When **all** requested legs failed, states that none of the requested searches could be completed (a user-safe line; deeper full-failure UX is out of scope — see below).
- Contains **no** raw error text; tracebacks remain in server logs only.

`language` at the call site is already the resolved string `"Portuguese"` / `"English"` (the service converts it before building the prompt), so the util branches on that value — consistent with how the existing prompt already branches on language.

### 2. Wiring into `copilot-chat.service.ts`

Follow the existing local-ref pattern (introduced to fix a prior concurrency bug):

- Add `const searchOutcomesRef: { value: SearchOutcome[] } = { value: [] };` and pass it into `createFactCheckingReportTool` alongside `editorReportRef` / `executionIdRef`.
- In the tool `func`:
  - **Success path:** push `{ searchType: data.searchType, status: "ok" }`.
  - **`catch` block:** push `{ searchType: data.searchType, status: "failed" }`, keep `this.logger.error(error)`, and return a concise sanitized observation (e.g. `` `A busca ${data.searchType} falhou e não retornou resultados.` ``) **instead of** `String(error)`, so the LLM cannot echo a traceback.
- After `agentExecutor.invoke(...)`, compute **once**:
  ```ts
  const finalContent = applyFailureDisclosure(
      response.output,
      searchOutcomesRef.value,
      language
  );
  ```
  and use `finalContent` for **both** the persisted `assistantMessage.content` and the returned `customMessage` payload — so the stored transcript is faithful (fixes the "transcript hid the failure" complaint), not just the live response.
- Import `SearchType` from the util; remove the local enum definition.

### 3. Prompt tweak (one line)

Add to the Rules block of the system prompt: instruct the agent to summarize only successful searches and never include raw error text, because the system prepends failure disclosure deterministically. Prevents double-disclosure while the guarantee remains in code.

## Data flow

```
user: "ambos"
  → agent calls get-fact-checking-report (online)   → push outcome
  → agent calls get-fact-checking-report (gazettes)  → push outcome
  → agentExecutor.invoke returns response.output
  → applyFailureDisclosure(output, outcomes, language)
        prepends failure line iff any leg failed
  → finalContent persisted AND returned
```

## Error handling & edge cases

| Case | Behavior |
|------|----------|
| One leg fails, one succeeds (the Gap A case) | Disclosure line + surviving result; retry offer for the failed leg |
| Single search, succeeds | No failed outcome → output unchanged |
| Single search, fails | Failure line prepended (output refinement is UX #2) |
| Same `searchType` called twice | `summarizeOutcomes` last-wins → a retry that succeeds clears the failure |
| No tool call (still gathering slots) | Empty outcomes → output unchanged |

## Testing (vitest, TDD)

New `server/copilot/copilot-disclosure.util.spec.ts` unit-tests the pure functions directly (no LangChain mocking required):

- failed `online` + ok `gazettes` → disclosure mentions online failure, includes surviving-result framing + retry offer.
- all `ok` → `applyFailureDisclosure` returns output unchanged; `buildFailureDisclosure` returns `""`.
- `summarizeOutcomes`: repeated `online` (failed then ok) collapses to `ok`; repeated (ok then failed) collapses to `failed`.
- Portuguese vs English wording.
- empty outcomes → `""` / unchanged.

The service wiring stays thin enough to verify by reading; the behavioral guarantee is covered by the util tests.

## Out of scope (UX #2 — separate follow-up)

- Global raw-error sanitization across all copilot error paths.
- Mapping every backend error to a friendly user-facing message.
- Retry circuit-breaking (stop re-offering "tentar novamente" after repeated identical failures).

This change makes only the **partial-failure disclosure line** user-safe; it does not attempt the broader error-UX overhaul.

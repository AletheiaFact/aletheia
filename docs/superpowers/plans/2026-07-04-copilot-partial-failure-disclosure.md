# Copilot Partial-Failure Disclosure (Gap A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guarantee the copilot discloses when one of multiple requested fact-check searches (online / gazettes) fails, instead of silently presenting only the surviving search.

**Architecture:** A new pure, dependency-free util module (`copilot-disclosure.util.ts`) owns the `SearchType` enum plus outcome-tracking and disclosure-composition logic. `copilot-chat.service.ts` records each tool invocation's outcome in a shared ref (reusing the existing `editorReportRef`/`executionIdRef` pattern) and, after the agent run, deterministically prepends a user-safe disclosure block to the LLM output before persisting and returning it. Disclosure becomes a code guarantee, not an LLM behavior.

**Tech Stack:** TypeScript, NestJS, LangChain tool-calling agent, Vitest (globals enabled, unit project globs `server/**/*.spec.ts`).

---

## Context for the implementer

- Working directory: `/Users/mbsantos/workspace/aletheia_fact/aletheia`
- Branch: `feat/copilot-partial-failure-disclosure` (already created off `origin/stage`)
- Spec: `docs/superpowers/specs/2026-07-04-copilot-partial-failure-disclosure-design.md`
- Run a single unit test file: `yarn test:unit server/copilot/copilot-disclosure.util.spec.ts`
- Typecheck: `yarn lint` (runs `tsc --noEmit` then eslint). For a faster type-only check use `npx tsc --noEmit`.
- Vitest has `globals: true` — do NOT import `describe`/`it`/`expect`; they are global (matches `server/editor-parse/editor-parse.service.spec.ts`).

### File structure

- **Create** `server/copilot/copilot-disclosure.util.ts` — owns `SearchType`, `SearchOutcome`, and the pure disclosure functions. Single responsibility: turn a list of search outcomes into a user-safe, localized disclosure string. No Nest/LangChain imports.
- **Create** `server/copilot/copilot-disclosure.util.spec.ts` — unit tests for the util.
- **Modify** `server/copilot/copilot-chat.service.ts` — import `SearchType` from the util (remove the local enum), track outcomes via a shared ref, sanitize the failed-leg tool observation, and apply the disclosure to the final content.

---

## Task 1: Pure disclosure util (TDD)

**Files:**
- Create: `server/copilot/copilot-disclosure.util.ts`
- Test: `server/copilot/copilot-disclosure.util.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `server/copilot/copilot-disclosure.util.spec.ts`:

```typescript
import {
    SearchType,
    SearchOutcome,
    summarizeOutcomes,
    buildFailureDisclosure,
    applyFailureDisclosure,
} from "./copilot-disclosure.util";

describe("copilot-disclosure.util", () => {
    describe("summarizeOutcomes", () => {
        it("collapses repeated searchType last-write-wins (failed then ok → ok)", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.online, status: "ok" },
            ];
            expect(summarizeOutcomes(outcomes)).toEqual([
                { searchType: SearchType.online, status: "ok" },
            ]);
        });

        it("collapses repeated searchType last-write-wins (ok then failed → failed)", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.gazettes, status: "ok" },
                { searchType: SearchType.gazettes, status: "failed" },
            ];
            expect(summarizeOutcomes(outcomes)).toEqual([
                { searchType: SearchType.gazettes, status: "failed" },
            ]);
        });
    });

    describe("buildFailureDisclosure", () => {
        it("returns empty string when nothing failed", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "ok" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            expect(buildFailureDisclosure(outcomes, "Portuguese")).toBe("");
        });

        it("returns empty string for empty outcomes", () => {
            expect(buildFailureDisclosure([], "Portuguese")).toBe("");
        });

        it("discloses failed online leg + retry offer when gazettes succeeded (pt)", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const msg = buildFailureDisclosure(outcomes, "Portuguese");
            expect(msg).toContain("busca online");
            expect(msg).toContain("diários oficiais");
            expect(msg.toLowerCase()).toContain("novamente");
        });

        it("discloses in English when language is English", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const msg = buildFailureDisclosure(outcomes, "English");
            expect(msg).toContain("online search");
            expect(msg).toContain("public gazette search");
            expect(msg.toLowerCase()).toContain("retry");
        });

        it("states all searches failed when none succeeded", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
            ];
            const msg = buildFailureDisclosure(outcomes, "Portuguese");
            expect(msg.toLowerCase()).toContain("nenhuma");
            expect(msg).toContain("busca online");
        });
    });

    describe("applyFailureDisclosure", () => {
        it("prepends disclosure above the output when a leg failed", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.online, status: "failed" },
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const result = applyFailureDisclosure(
                "Resultado dos diários oficiais...",
                outcomes,
                "Portuguese"
            );
            expect(result.startsWith("⚠️")).toBe(true);
            expect(result).toContain("Resultado dos diários oficiais...");
        });

        it("returns output unchanged when nothing failed", () => {
            const outcomes: SearchOutcome[] = [
                { searchType: SearchType.gazettes, status: "ok" },
            ];
            const output = "Resultado...";
            expect(applyFailureDisclosure(output, outcomes, "Portuguese")).toBe(
                output
            );
        });
    });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test:unit server/copilot/copilot-disclosure.util.spec.ts`
Expected: FAIL — cannot resolve `./copilot-disclosure.util` (module does not exist yet).

- [ ] **Step 3: Implement the util**

Create `server/copilot/copilot-disclosure.util.ts`:

```typescript
/**
 * Pure, dependency-free helpers for disclosing partial fact-check search
 * failures to the user. Owns the SearchType enum so this module has no
 * dependency on the copilot service (one-way: service → util).
 */

export enum SearchType {
    online = "online",
    gazettes = "gazettes",
}

export type SearchStatus = "ok" | "failed";

export interface SearchOutcome {
    searchType: SearchType;
    status: SearchStatus;
}

const SEARCH_LABELS: Record<
    SearchType,
    { Portuguese: string; English: string }
> = {
    [SearchType.online]: {
        Portuguese: "busca online",
        English: "online search",
    },
    [SearchType.gazettes]: {
        Portuguese: "busca nos diários oficiais",
        English: "public gazette search",
    },
};

function label(searchType: SearchType, language: string): string {
    const entry = SEARCH_LABELS[searchType];
    return language === "Portuguese" ? entry.Portuguese : entry.English;
}

function joinList(items: string[], language: string): string {
    if (items.length <= 1) {
        return items[0] ?? "";
    }
    const conjunction = language === "Portuguese" ? " e " : " and ";
    return (
        items.slice(0, -1).join(", ") + conjunction + items[items.length - 1]
    );
}

/**
 * Collapse repeated calls per searchType (last-write-wins), so an LLM retry
 * of a failed leg that later succeeds does not leave a false "failed" outcome.
 */
export function summarizeOutcomes(outcomes: SearchOutcome[]): SearchOutcome[] {
    const byType = new Map<SearchType, SearchStatus>();
    for (const outcome of outcomes) {
        byType.set(outcome.searchType, outcome.status);
    }
    return Array.from(byType.entries()).map(([searchType, status]) => ({
        searchType,
        status,
    }));
}

/**
 * "" when nothing failed; otherwise a user-safe, localized disclosure block.
 * Never contains raw error text or tracebacks.
 */
export function buildFailureDisclosure(
    outcomes: SearchOutcome[],
    language: string
): string {
    const summary = summarizeOutcomes(outcomes);
    const failed = summary.filter((o) => o.status === "failed");
    if (failed.length === 0) {
        return "";
    }

    const succeeded = summary.filter((o) => o.status === "ok");
    const isPt = language === "Portuguese";
    const failedList = joinList(
        failed.map((o) => label(o.searchType, language)),
        language
    );

    if (succeeded.length > 0) {
        const succeededList = joinList(
            succeeded.map((o) => label(o.searchType, language)),
            language
        );
        return isPt
            ? `⚠️ A ${failedList} não pôde ser concluída. Segue apenas o resultado da ${succeededList}. Deseja tentar a ${failedList} novamente?`
            : `⚠️ The ${failedList} could not be completed. Only the result of the ${succeededList} is shown below. Would you like to retry the ${failedList}?`;
    }

    return isPt
        ? `⚠️ Nenhuma das buscas solicitadas (${failedList}) pôde ser concluída. Deseja tentar novamente?`
        : `⚠️ None of the requested searches (${failedList}) could be completed. Would you like to try again?`;
}

/**
 * Prepend the disclosure block to the LLM output.
 * Returns output unchanged when no leg failed.
 */
export function applyFailureDisclosure(
    output: string,
    outcomes: SearchOutcome[],
    language: string
): string {
    const disclosure = buildFailureDisclosure(outcomes, language);
    if (!disclosure) {
        return output;
    }
    return `${disclosure}\n\n${output}`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn test:unit server/copilot/copilot-disclosure.util.spec.ts`
Expected: PASS — all tests in the suite green.

- [ ] **Step 5: Commit**

```bash
git add server/copilot/copilot-disclosure.util.ts server/copilot/copilot-disclosure.util.spec.ts
git commit -m "feat(copilot): add pure partial-failure disclosure util"
```

---

## Task 2: Wire disclosure into the copilot chat service

**Files:**
- Modify: `server/copilot/copilot-chat.service.ts`

No new unit test: the behavioral guarantee is covered by Task 1's util tests, and the spec states the service wiring is thin enough to verify by reading + typecheck. Each step below is a precise edit with before/after code.

- [ ] **Step 1: Import `SearchType` from the util and remove the local enum**

In `server/copilot/copilot-chat.service.ts`, add to the import block (near the other `./` imports, after the `CopilotSourceService` import around line 33):

```typescript
import {
    SearchType,
    SearchOutcome,
    applyFailureDisclosure,
} from "./copilot-disclosure.util";
```

Then DELETE the local enum declaration (currently around lines 35-38):

```typescript
enum SearchType {
    online = "online",
    gazettes = "gazettes",
}
```

- [ ] **Step 2: Accept a `searchOutcomesRef` in the tool factory**

Change the `createFactCheckingReportTool` signature (currently around lines 51-56) FROM:

```typescript
    private createFactCheckingReportTool(
        editorReportRef: { value: any },
        executionIdRef: { value: string | null },
        userId: string,
        sessionId: string
    ) {
```

TO:

```typescript
    private createFactCheckingReportTool(
        editorReportRef: { value: any },
        executionIdRef: { value: string | null },
        searchOutcomesRef: { value: SearchOutcome[] },
        userId: string,
        sessionId: string
    ) {
```

- [ ] **Step 3: Record an "ok" outcome on the success path**

Inside the tool `func`, the success path ends with `return stream;` (currently line 151). Immediately BEFORE that `return stream;`, add:

```typescript
                    searchOutcomesRef.value.push({
                        searchType: data.searchType,
                        status: "ok",
                    });
                    return stream;
```

- [ ] **Step 4: Record a "failed" outcome and sanitize the observation in `catch`**

Change the tool `func` `catch` block (currently lines 152-155) FROM:

```typescript
                } catch (error) {
                    this.logger.error(error);
                    return String(error);
                }
```

TO:

```typescript
                } catch (error) {
                    this.logger.error(error);
                    searchOutcomesRef.value.push({
                        searchType: data.searchType,
                        status: "failed",
                    });
                    // Return a concise, user-safe observation instead of the raw
                    // error, so the LLM cannot echo a traceback. Deterministic
                    // failure disclosure is applied after the agent run.
                    return `A busca ${data.searchType} falhou e não retornou resultados.`;
                }
```

- [ ] **Step 5: Create the `searchOutcomesRef` and pass it into the tool factory**

In `agentChat`, where the refs are created (currently lines 229-240), add the new ref and pass it into `createFactCheckingReportTool`. Change FROM:

```typescript
            const editorReportRef: { value: any } = { value: null };
            const executionIdRef: { value: string | null } = { value: null };
            const tools = [
                new DynamicStructuredTool(
                    this.createFactCheckingReportTool(
                        editorReportRef,
                        executionIdRef,
                        userId,
                        sessionId
                    ) as any
                ),
            ];
```

TO:

```typescript
            const editorReportRef: { value: any } = { value: null };
            const executionIdRef: { value: string | null } = { value: null };
            const searchOutcomesRef: { value: SearchOutcome[] } = {
                value: [],
            };
            const tools = [
                new DynamicStructuredTool(
                    this.createFactCheckingReportTool(
                        editorReportRef,
                        executionIdRef,
                        searchOutcomesRef,
                        userId,
                        sessionId
                    ) as any
                ),
            ];
```

- [ ] **Step 6: Apply the disclosure to the final content, used for both persistence and response**

After `const response = await agentExecutor.invoke({ ... });` (the invoke ends around line 310) and BEFORE building `assistantMessage` (currently line 312), insert:

```typescript
            // Deterministically disclose any failed search leg, independent of
            // how the LLM phrased its answer. Used for BOTH the persisted
            // transcript and the returned payload so the record is faithful.
            const finalContent = applyFailureDisclosure(
                response.output,
                searchOutcomesRef.value,
                language
            );
```

Then change the persisted `assistantMessage.content` (currently line 316) FROM:

```typescript
            const assistantMessage: any = {
                sender: SenderEnum.Assistant,
                content: response.output,
                type: "info",
            };
```

TO:

```typescript
            const assistantMessage: any = {
                sender: SenderEnum.Assistant,
                content: finalContent,
                type: "info",
            };
```

And change the returned `customMessage` payload `content` (currently line 331) FROM:

```typescript
            return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, {
                sender: SenderEnum.Assistant,
                content: response.output,
                editorReport: editorReportRef.value,
                executionId: executionIdRef.value,
            });
```

TO:

```typescript
            return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, {
                sender: SenderEnum.Assistant,
                content: finalContent,
                editorReport: editorReportRef.value,
                executionId: executionIdRef.value,
            });
```

- [ ] **Step 7: Add the one-line prompt rule**

In the system prompt's `## Rules` block (currently lines 272-276), add a final bullet after the existing rules, before the closing backtick of the template:

```typescript
- If a search returns a failure observation, summarize only the searches that succeeded and never include raw error text; the system discloses failed searches to the user automatically.
```

- [ ] **Step 8: Typecheck and re-run the util tests**

Run: `npx tsc --noEmit`
Expected: no type errors (in particular, no "Cannot find name 'SearchType'" and no unused-symbol errors).

Run: `yarn test:unit server/copilot/copilot-disclosure.util.spec.ts`
Expected: PASS — util tests still green.

- [ ] **Step 9: Commit**

```bash
git add server/copilot/copilot-chat.service.ts
git commit -m "feat(copilot): disclose partial search failures deterministically"
```

---

## Self-review notes

- **Spec coverage:** util module (§Design 1) → Task 1; service wiring incl. shared ref, sanitized catch observation, single `finalContent` for persistence + response (§Design 2) → Task 2 steps 2-6; prompt tweak (§Design 3) → Task 2 step 7; edge cases (single/dup/no-call) → covered by `summarizeOutcomes` + `buildFailureDisclosure` tests in Task 1. Out-of-scope items (UX #2) are intentionally not implemented.
- **Type consistency:** `SearchType`, `SearchOutcome`, `SearchStatus`, `summarizeOutcomes`, `buildFailureDisclosure`, `applyFailureDisclosure` names are identical across the util, its spec, and the service edits. The service passes `language` (already resolved to `"Portuguese"`/`"English"` earlier in `agentChat`) to `applyFailureDisclosure`, matching the util's branch condition.
- **No placeholders:** every code step shows complete before/after content.
```

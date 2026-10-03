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

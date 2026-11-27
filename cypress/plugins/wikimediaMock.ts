import http from "http";
import {
    defaultWikidataItems,
    wikidataItem,
    WikidataItemInput,
} from "../fixtures/wikidata";

/**
 * A stand-in for the Wikidata and Commons APIs the server calls
 * (server/wikidata/wikidata.service.ts). config.test.ci.yaml points
 * `wikidata.api_url` at /wikidata/w/api.php and `wikidata.commons_api_url`
 * at /commons/w/api.php on this server.
 *
 * Specs change what it answers through the tasks in `wikimediaMockTasks`,
 * for example to make an item deleted, merged, rate-limited or of another
 * type. Each answer copies the shape the real API gives for that case.
 */

export type FailureMode =
    // What wikidata.org sends when it rate-limits: HTTP 200, plain text.
    | "rate-limit-page"
    // HTTP 429 with plain text.
    | "http-429"
    // HTTP 200 with an API error object instead of entities.
    | "error-object";

interface MockState {
    entities: Record<string, ReturnType<typeof wikidataItem>>;
    redirects: Record<string, string>;
    failures: Record<string, FailureMode>;
    files: Record<string, string>;
    requests: { api: string; action: string; target: string }[];
}

const RATE_LIMIT_TEXT =
    "You are making too many requests to the API.\n" +
    "Please follow the best practices at " +
    "https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits.\n";

const freshState = (): MockState => ({
    entities: Object.fromEntries(
        defaultWikidataItems.map((item) => [item.id, wikidataItem(item)])
    ),
    redirects: {},
    failures: {},
    files: {},
    requests: [],
});

let state = freshState();

type Reply = { status: number; contentType: string; body: string };

const json = (body: unknown): Reply => ({
    status: 200,
    contentType: "application/json; charset=utf-8",
    body: JSON.stringify(body),
});

const failure = (mode: FailureMode): Reply => {
    switch (mode) {
        case "rate-limit-page":
            return {
                status: 200,
                contentType: "text/plain",
                body: RATE_LIMIT_TEXT,
            };
        case "http-429":
            return {
                status: 429,
                contentType: "text/plain",
                body: RATE_LIMIT_TEXT,
            };
        case "error-object":
            return json({
                error: {
                    code: "maxlag",
                    info: "Waiting for a database server",
                },
            });
    }
};

const pick = (
    values: Record<string, unknown> | undefined,
    language: string
): any => values?.[language] ?? values?.en;

const getEntities = (ids: string): Reply => {
    // The server always asks for one id at a time.
    const id = ids.split("|")[0];
    if (state.failures[id]) return failure(state.failures[id]);

    const target = state.redirects[id] ?? id;
    const entity = state.entities[target];
    if (!entity) {
        // A deleted (or never created) item.
        return json({ entities: { [id]: { id, missing: "" } }, success: 1 });
    }
    // A merged item is keyed by the id it redirects to.
    const answer =
        target === id
            ? entity
            : { ...entity, redirects: { from: id, to: target } };
    return json({ entities: { [target]: answer }, success: 1 });
};

const searchEntities = (search: string, language: string): Reply => {
    if (state.failures.search) return failure(state.failures.search);

    const term = search.trim().toLowerCase();
    const results = Object.values(state.entities).flatMap((entity) => {
        const label: string | undefined = pick(entity.labels, language)?.value;
        const aliases: string[] = (pick(entity.aliases, language) || []).map(
            (alias: { value: string }) => alias.value
        );
        const matches =
            term !== "" &&
            [label, ...aliases].some((value) =>
                value?.toLowerCase().includes(term)
            );
        if (!matches) return [];
        return [
            {
                id: entity.id,
                label,
                description: pick(entity.descriptions, language)?.value,
                aliases,
            },
        ];
    });
    return json({ searchinfo: { search }, search: results, success: 1 });
};

const commonsQuery = (titles: string): Reply => {
    if (state.failures.commons) return failure(state.failures.commons);

    const fileName = titles.replace(/^File:/, "");
    const thumburl = state.files[fileName];
    return json({
        batchcomplete: true,
        query: {
            pages: [
                thumburl
                    ? { title: titles, imageinfo: [{ thumburl }] }
                    : { title: titles, missing: true },
            ],
        },
    });
};

const route = (url: URL): Reply => {
    const params = url.searchParams;
    const action = params.get("action") || "";

    if (url.pathname === "/wikidata/w/api.php") {
        if (action === "wbgetentities") {
            const ids = params.get("ids") || "";
            state.requests.push({ api: "wikidata", action, target: ids });
            return getEntities(ids);
        }
        if (action === "wbsearchentities") {
            const search = params.get("search") || "";
            state.requests.push({ api: "wikidata", action, target: search });
            return searchEntities(search, params.get("language") || "en");
        }
    }
    if (url.pathname === "/commons/w/api.php" && action === "query") {
        const titles = params.get("titles") || "";
        state.requests.push({ api: "commons", action, target: titles });
        return commonsQuery(titles);
    }
    return { status: 404, contentType: "text/plain", body: "not mocked" };
};

let server: http.Server | undefined;

export const startWikimediaMock = (port: number) => {
    if (server) return;
    server = http.createServer((req, res) => {
        const reply = route(
            new URL(req.url || "/", `http://127.0.0.1:${port}`)
        );
        res.writeHead(reply.status, { "Content-Type": reply.contentType });
        res.end(reply.body);
    });
    server.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
            // Another Cypress process already serves the mock (cypress open
            // reloads the config); its state is the one the server sees.
            console.warn(`Wikimedia mock: port ${port} is already in use`);
            return;
        }
        throw error;
    });
    server.listen(port, "127.0.0.1");
};

export const wikimediaMockTasks = {
    wikimediaMockReset: () => {
        state = freshState();
        return null;
    },
    /** Adds or replaces an item. */
    wikimediaMockSetItem: (item: WikidataItemInput) => {
        state.entities[item.id] = wikidataItem(item);
        delete state.failures[item.id];
        return null;
    },
    /** Deletes an item: wbgetentities answers { id, missing: "" }. */
    wikimediaMockDeleteItem: (id: string) => {
        delete state.entities[id];
        return null;
    },
    /** Merges `from` into `to`, as when Wikidata merges duplicates. */
    wikimediaMockRedirect: ({ from, to }: { from: string; to: string }) => {
        delete state.entities[from];
        state.redirects[from] = to;
        return null;
    },
    /** Makes requests for one item ("search" / "commons" for those APIs) fail. */
    wikimediaMockFail: ({ id, mode }: { id: string; mode: FailureMode }) => {
        state.failures[id] = mode;
        return null;
    },
    /** Makes a Commons file exist with this thumbnail URL. */
    wikimediaMockSetFile: ({
        fileName,
        thumburl,
    }: {
        fileName: string;
        thumburl: string;
    }) => {
        state.files[fileName] = thumburl;
        return null;
    },
    /** The requests the server made since the last reset. */
    wikimediaMockRequests: () => state.requests,
};

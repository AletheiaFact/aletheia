import {
    personalitySuggestions,
    topicSuggestions,
} from "../fixtures/wikidata";

const matches = (search: unknown, values: string[]) => {
    const term = String(search || "").trim().toLowerCase();
    return term !== "" && values.some((v) => v.toLowerCase().includes(term));
};

before(() => {
    cy.task("seedWikidataCache");
});

beforeEach(() => {
    // Personality search with Wikidata suggestions: let the server answer
    // from the database only, then append the offline suggestions that are
    // not created yet (same merge the server does by wikidata id).
    cy.intercept(
        { method: "GET", url: /\/api\/personality\/?\?.*withSuggestions=true/ },
        (req) => {
            const name = req.query.name;
            req.query.withSuggestions = "false";
            req.continue((res) => {
                const personalities = res.body?.personalities;
                if (!Array.isArray(personalities)) return;
                const known = new Set(personalities.map((p) => p.wikidata));
                personalitySuggestions
                    .filter((s) => !known.has(s.wikidata))
                    .filter((s) => matches(name, [s.name]))
                    .forEach((s) => personalities.unshift({ ...s }));
            });
        }
    );

    // Topic autocomplete is a pure Wikidata search on the server.
    cy.intercept(
        { method: "GET", url: /\/api\/topics\/?\?topicName=/ },
        (req) => {
            req.reply(
                topicSuggestions
                    .filter((t) =>
                        matches(req.query.topicName, [t.name, ...t.aliases])
                    )
                    .map((t) => ({
                        ...t,
                        matchedAlias:
                            t.aliases.find((a) =>
                                matches(req.query.topicName, [a])
                            ) || null,
                    }))
            );
        }
    );
});

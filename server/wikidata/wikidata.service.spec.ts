import { WikidataService, WikidataUnavailableError } from "./wikidata.service";

/**
 * Builds a WikidataService with an in-memory cache and a stubbed HTTP layer.
 * `responses` maps a URL to the body Wikimedia gives for it.
 */
function makeService(
    responses: Record<string, unknown | Error>,
    cached: unknown = null
) {
    const cacheModel = {
        findOne: vi.fn(() => ({ exec: vi.fn().mockResolvedValue(cached) })),
        findOneAndUpdate: vi.fn().mockResolvedValue(undefined),
    };
    const service = new WikidataService(cacheModel as any);
    const get = vi.fn(async (url: string) => {
        const body = responses[url];
        if (body instanceof Error) throw body;
        return body;
    });
    (service as any).wikimediaGet = get;
    return { service, cacheModel, get };
}

const WIKIDATA = "https://www.wikidata.org/w/api.php";
const COMMONS = "https://commons.wikimedia.org/w/api.php";

const human = (id: string, extraClaims: Record<string, unknown> = {}) => ({
    id,
    labels: { pt: { value: "Rosane de Oliveira" } },
    descriptions: { pt: { value: "jornalista" } },
    claims: {
        P31: [{ mainsnak: { datavalue: { value: { id: "Q5" } } } }],
        ...extraClaims,
    },
});

describe("WikidataService", () => {
    describe("fetchProperties", () => {
        it("caches a valid entity", async () => {
            const { service, cacheModel } = makeService({
                [WIKIDATA]: { entities: { Q1: human("Q1") } },
            });

            const props = await service.fetchProperties({
                wikidataId: "Q1",
                language: "pt",
            });

            expect(props.name).toBe("Rosane de Oliveira");
            expect(props.isAllowedProp).toBe(true);
            expect(cacheModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
        });

        it("throws and does not cache a rate-limit page (plain text)", async () => {
            const { service, cacheModel } = makeService({
                [WIKIDATA]: "You are making too many requests to the API.",
            });

            await expect(
                service.fetchProperties({ wikidataId: "Q1", language: "pt" })
            ).rejects.toBeInstanceOf(WikidataUnavailableError);
            expect(cacheModel.findOneAndUpdate).not.toHaveBeenCalled();
        });

        it("throws and does not cache an API error object", async () => {
            const { service, cacheModel } = makeService({
                [WIKIDATA]: { error: { code: "maxlag" } },
            });

            await expect(
                service.fetchProperties({ wikidataId: "Q1", language: "pt" })
            ).rejects.toBeInstanceOf(WikidataUnavailableError);
            expect(cacheModel.findOneAndUpdate).not.toHaveBeenCalled();
        });

        it("does not cache when the Commons image request fails", async () => {
            const { service, cacheModel } = makeService({
                [WIKIDATA]: {
                    entities: {
                        Q1: human("Q1", {
                            P18: [
                                {
                                    mainsnak: {
                                        datavalue: { value: "Photo.jpg" },
                                    },
                                },
                            ],
                        }),
                    },
                },
                [COMMONS]: new Error("socket hang up"),
            });

            await expect(
                service.fetchProperties({ wikidataId: "Q1", language: "pt" })
            ).rejects.toThrow("socket hang up");
            expect(cacheModel.findOneAndUpdate).not.toHaveBeenCalled();
        });

        it("caches a disallowed type so it is not refetched on every view", async () => {
            const { service, cacheModel } = makeService({
                [WIKIDATA]: {
                    entities: {
                        Q2: {
                            id: "Q2",
                            labels: { pt: { value: "Fonseca" } },
                            claims: {
                                P31: [
                                    {
                                        mainsnak: {
                                            datavalue: {
                                                value: { id: "Q101352" },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            });

            const props = await service.fetchProperties({
                wikidataId: "Q2",
                language: "pt",
            });

            expect(props.isAllowedProp).toBe(false);
            expect(cacheModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
        });

        it("returns the cached props without calling Wikimedia", async () => {
            const { service, get } = makeService(
                {},
                { props: { name: "Cached", twitterAccounts: [] } }
            );

            const props = await service.fetchProperties({
                wikidataId: "Q1",
                language: "pt",
            });

            expect(props.name).toBe("Cached");
            expect(get).not.toHaveBeenCalled();
        });
    });

    describe("requestProperties", () => {
        it("gives empty props for a deleted item", async () => {
            const { service } = makeService({
                [WIKIDATA]: { entities: { Q9: { id: "Q9", missing: "" } } },
            });

            const props = await service.requestProperties({
                wikidataId: "Q9",
                language: "pt",
            });

            expect(props.name).toBeUndefined();
            expect(props.isAllowedProp).toBeUndefined();
        });

        it("follows a redirect keyed by the target id", async () => {
            const { service } = makeService({
                [WIKIDATA]: {
                    entities: {
                        Q65167291: {
                            ...human("Q65167291"),
                            redirects: { from: "Q95739122", to: "Q65167291" },
                        },
                    },
                },
            });

            const props = await service.requestProperties({
                wikidataId: "Q95739122",
                language: "pt",
            });

            expect(props.name).toBe("Rosane de Oliveira");
            expect(props.isAllowedProp).toBe(true);
        });
    });

    describe("extractProperties", () => {
        it("does not crash on a P31 'no value' claim", async () => {
            const { service } = makeService({});

            const props = await service.extractProperties(
                {
                    labels: { pt: { value: "X" } },
                    claims: {
                        P31: [{ mainsnak: { snaktype: "novalue" } }],
                    },
                },
                "pt"
            );

            expect(props.isAllowedProp).toBe(false);
        });

        it("skips Twitter claims without a value", async () => {
            const { service } = makeService({});

            const props = await service.extractProperties(
                human("Q1", {
                    P2002: [
                        { mainsnak: { snaktype: "somevalue" } },
                        { mainsnak: { datavalue: { value: "rosane" } } },
                    ],
                }),
                "pt"
            );

            expect(props.twitterAccounts).toEqual(["rosane"]);
        });
    });

    describe("getCommonsThumbURL", () => {
        it("gives undefined for a deleted Commons file", async () => {
            const { service } = makeService({
                [COMMONS]: {
                    query: {
                        pages: [{ title: "File:Gone.jpg", missing: true }],
                    },
                },
            });

            await expect(
                service.getCommonsThumbURL("Gone.jpg", 100)
            ).resolves.toBeUndefined();
        });

        it("gives the thumbnail URL", async () => {
            const { service } = makeService({
                [COMMONS]: {
                    query: {
                        pages: [
                            {
                                imageinfo: [
                                    { thumburl: "https://x/thumb.jpg" },
                                ],
                            },
                        ],
                    },
                },
            });

            await expect(
                service.getCommonsThumbURL("A.jpg", 100)
            ).resolves.toBe("https://x/thumb.jpg");
        });
    });
});

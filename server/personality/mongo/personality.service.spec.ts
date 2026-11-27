import { MongoPersonalityService } from "./personality.service";
import { UtilService } from "../../util";
import { WikidataUnavailableError } from "../../wikidata/wikidata.service";

/**
 * postProcess must never hide a personality that exists in our database
 * because of Wikidata. Only search suggestions (Wikidata entities without an
 * `_id`) are filtered by the allowed-type check.
 */
function makeService(fetchProperties: (...args: any[]) => Promise<any>) {
    const req = { params: {}, query: {} } as any;
    const claimReview = { agreggateClassification: async () => [] } as any;
    const wikidata = { fetchProperties: vi.fn(fetchProperties) } as any;
    const service = new MongoPersonalityService(
        req,
        {} as any,
        claimReview,
        {} as any,
        wikidata,
        new UtilService()
    );
    return { service, wikidata };
}

const stored = () => ({
    _id: "64b000000000000000000001",
    name: "Geraldo Castro",
    description: "Radialista",
    wikidata: "Q142068353",
});

describe("MongoPersonalityService.postProcess", () => {
    it("keeps a personality whose Wikidata item is not an allowed type", async () => {
        const { service } = makeService(async () => ({
            isAllowedProp: false,
            name: "Castro (surname)",
            twitterAccounts: [],
        }));

        const result = await service.postProcess(stored(), "pt");

        expect(result).toBeDefined();
        expect(result.name).toBe("Geraldo Castro");
    });

    it("keeps the stored fields when Wikidata is unavailable", async () => {
        const { service } = makeService(async () => {
            throw new WikidataUnavailableError("Q142068353", "rate limited");
        });

        const result = await service.postProcess(stored(), "pt");

        expect(result.name).toBe("Geraldo Castro");
        expect(result.description).toBe("Radialista");
    });

    it("keeps the stored fields when the Wikidata item is deleted", async () => {
        const { service } = makeService(async () => ({
            name: undefined,
            description: undefined,
            isAllowedProp: undefined,
            twitterAccounts: [],
        }));

        const result = await service.postProcess(stored(), "pt");

        expect(result.name).toBe("Geraldo Castro");
        expect(result.description).toBe("Radialista");
    });

    it("does not call Wikidata for a personality without a Wikidata id", async () => {
        const { service, wikidata } = makeService(async () => ({}));

        const result = await service.postProcess(
            { ...stored(), wikidata: null },
            "pt"
        );

        expect(result.name).toBe("Geraldo Castro");
        expect(wikidata.fetchProperties).not.toHaveBeenCalled();
    });

    it("uses Wikidata data when it is available", async () => {
        const { service } = makeService(async () => ({
            name: "Geraldo Castro (Wikidata)",
            avatar: "https://x/a.jpg",
            isAllowedProp: true,
            twitterAccounts: [],
        }));

        const result = await service.postProcess(stored(), "pt");

        expect(result.name).toBe("Geraldo Castro (Wikidata)");
        expect(result.avatar).toBe("https://x/a.jpg");
    });

    it("drops a search suggestion that is not an allowed type", async () => {
        const { service } = makeService(async () => ({
            isAllowedProp: false,
            twitterAccounts: [],
        }));

        const result = await service.postProcess(
            { name: "Duque de Caxias", wikidata: "Q193021" },
            "pt"
        );

        expect(result).toBeUndefined();
    });

    it("drops a search suggestion when Wikidata is unavailable", async () => {
        const { service } = makeService(async () => {
            throw new Error("timeout");
        });

        const result = await service.postProcess(
            { name: "Someone", wikidata: "Q1" },
            "pt"
        );

        expect(result).toBeUndefined();
    });
});

describe("MongoPersonalityService.create", () => {
    function makeCreateService(
        checkItem: (...args: any[]) => Promise<any>,
        existing: any = null
    ) {
        const saved: any[] = [];
        const model: any = function (this: any, doc: any) {
            Object.assign(this, doc, { _id: "64b000000000000000000009" });
            this.save = async () => {
                saved.push(this);
                return this;
            };
        };
        model.findOne = vi.fn(async (filter: any) =>
            filter.isDeleted === false ? existing : null
        );
        const history = {
            getHistoryParams: vi.fn(() => ({})),
            createHistory: vi.fn(async () => undefined),
        };
        const wikidata = { checkItem: vi.fn(checkItem) };
        const service = new MongoPersonalityService(
            { params: {}, query: {}, user: { _id: "u1" } } as any,
            model,
            {} as any,
            history as any,
            wikidata as any,
            new UtilService()
        );
        return { service, saved, wikidata };
    }

    it("creates with the name and description from Wikidata", async () => {
        const { service, saved, wikidata } = makeCreateService(async () => ({
            status: "ok",
            props: { name: "Rosane de Oliveira", description: "jornalista" },
        }));

        await service.create({ wikidata: "Q142067648" });

        expect(wikidata.checkItem).toHaveBeenCalledWith("Q142067648", "pt", {
            fresh: true,
        });
        expect(saved[0]).toMatchObject({
            name: "Rosane de Oliveira",
            description: "jornalista",
            slug: "rosane-de-oliveira",
            wikidata: "Q142067648",
        });
    });

    it("rejects a deleted item", async () => {
        const { service } = makeCreateService(async () => ({
            status: "deleted",
            props: {},
        }));

        await expect(service.create({ wikidata: "Q9" })).rejects.toMatchObject({
            status: 400,
        });
    });

    it("rejects an item another personality uses", async () => {
        const { service } = makeCreateService(
            async () => ({ status: "ok", props: { name: "X" } }),
            { _id: "other", wikidata: "Q1" }
        );

        await expect(service.create({ wikidata: "Q1" })).rejects.toMatchObject({
            status: 409,
        });
    });

    it("answers 503 when Wikidata is unavailable", async () => {
        const { service } = makeCreateService(async () => {
            throw new WikidataUnavailableError("Q1", "rate limited");
        });

        await expect(service.create({ wikidata: "Q1" })).rejects.toMatchObject({
            status: 503,
        });
    });
});

describe("MongoPersonalityService.findOrCreatePersonality", () => {
    function makeFindService(opts: {
        byWikidata?: any;
        bySlug?: any;
        checkItem?: (...args: any[]) => Promise<any>;
    }) {
        const model: any = function (this: any, doc: any) {
            Object.assign(this, doc, { _id: "new" });
            this.save = async () => this;
        };
        model.findOne = vi.fn(async (filter: any) => {
            if (filter.wikidata) return opts.byWikidata ?? null;
            if (filter.slug) return opts.bySlug ?? null;
            return null;
        });
        const service = new MongoPersonalityService(
            { params: {}, query: {} } as any,
            model,
            {} as any,
            {
                getHistoryParams: vi.fn(() => ({})),
                createHistory: vi.fn(async () => undefined),
            } as any,
            {
                checkItem: vi.fn(
                    opts.checkItem ??
                        (async () => ({ status: "ok", props: { name: "Ana" } }))
                ),
            } as any,
            new UtilService()
        );
        return { service };
    }

    it("returns null when the AI gives no Wikidata id", async () => {
        const { service } = makeFindService({});

        await expect(
            service.findOrCreatePersonality({ name: "Bartolomeu Almeida" })
        ).resolves.toBeNull();
    });

    it("returns null when the item is deleted", async () => {
        const { service } = makeFindService({
            checkItem: async () => ({ status: "deleted", props: {} }),
        });

        await expect(
            service.findOrCreatePersonality({
                name: "Geraldo Castro",
                wikidata: { id: "Q142068353" },
            })
        ).resolves.toBeNull();
    });

    it("returns null when Wikidata is unavailable", async () => {
        const { service } = makeFindService({
            checkItem: async () => {
                throw new Error("timeout");
            },
        });

        await expect(
            service.findOrCreatePersonality({
                name: "Ana",
                wikidata: { id: "Q1" },
            })
        ).resolves.toBeNull();
    });

    it("still reuses a personality matched by slug", async () => {
        const existing = { _id: "p1", slug: "ana", wikidata: "Q1" };
        const { service } = makeFindService({ bySlug: existing });

        await expect(
            service.findOrCreatePersonality({ name: "Ana" })
        ).resolves.toBe(existing);
    });

    it("creates from a valid item", async () => {
        const { service } = makeFindService({});

        const created = await service.findOrCreatePersonality({
            name: "Ana",
            wikidata: { id: "Q1" },
        });

        expect(created).toMatchObject({ name: "Ana", wikidata: "Q1" });
    });
});

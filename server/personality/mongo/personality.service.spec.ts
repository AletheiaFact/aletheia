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
        return { service, saved, wikidata, model };
    }

    it("turns a duplicate-key error on save into a 409 in_use", async () => {
        const { service, model } = makeCreateService(async () => ({
            status: "ok",
            props: { name: "Rosane de Oliveira" },
        }));
        const ctor = model;
        const raced: any = function (this: any, doc: any) {
            Object.assign(this, doc, { _id: "x" });
            this.save = async () => {
                throw { code: 11000 };
            };
        };
        raced.findOne = ctor.findOne;
        (service as any).PersonalityModel = raced;

        await expect(
            service.create({ wikidata: "Q142067648" })
        ).rejects.toMatchObject({
            status: 409,
            response: { reason: "in_use" },
        });
    });

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

    it("restores a soft-deleted personality without checking Wikidata", async () => {
        const restored: any = { _id: "d1" };
        restored.restore = vi.fn(async () => restored);
        const { service, model, wikidata } = makeCreateService(async () => ({
            status: "ok",
            props: { name: "X" },
        }));
        model.findOne = vi.fn(async (filter: any) =>
            filter.isDeleted === true ? restored : null
        );

        await expect(service.create({ wikidata: "Q5" })).resolves.toBe(
            restored
        );
        expect(restored.restore).toHaveBeenCalled();
        expect(wikidata.checkItem).not.toHaveBeenCalled();
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
        return { service, model };
    }

    it("returns null when the AI gives no Wikidata id", async () => {
        const { service } = makeFindService({});

        await expect(
            service.findOrCreatePersonality({ name: "Bartolomeu Almeida" })
        ).resolves.toBeNull();
    });

    it("treats a malformed AI id as no id", async () => {
        const checkItem = vi.fn(async () => ({
            status: "ok",
            props: { name: "Ana" },
        }));
        const { service, model } = makeFindService({ checkItem });

        await expect(
            service.findOrCreatePersonality({
                name: "Ana",
                wikidata: { id: "not-an-id" },
            })
        ).resolves.toBeNull();
        expect(checkItem).not.toHaveBeenCalled();
        expect(model.findOne).not.toHaveBeenCalledWith(
            expect.objectContaining({ wikidata: expect.anything() })
        );
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

    it("creates from a valid item using the Wikidata name", async () => {
        const { service } = makeFindService({
            checkItem: async () => ({
                status: "ok",
                props: { name: "Ana Silva" },
            }),
        });

        const created = await service.findOrCreatePersonality({
            name: "Ana S.",
            wikidata: { id: "Q1" },
        });

        expect(created).toMatchObject({ name: "Ana Silva", wikidata: "Q1" });
    });

    it("returns null when a soft-deleted personality holds the id", async () => {
        const deleted: any = { _id: "d1", restore: vi.fn() };
        const { service, model } = makeFindService({});
        model.findOne = vi.fn(async (filter: any) =>
            filter.isDeleted === true && filter.wikidata ? deleted : null
        );

        await expect(
            service.findOrCreatePersonality({
                name: "Ana",
                wikidata: { id: "Q1" },
            })
        ).resolves.toBeNull();
        expect(deleted.restore).not.toHaveBeenCalled();
    });

    it("attaches the AI id to a slug match when the item is usable", async () => {
        const existing: any = {
            _id: "p1",
            slug: "ana",
            wikidata: undefined,
            save: vi.fn(async () => undefined),
        };
        const { service } = makeFindService({ bySlug: existing });

        await service.findOrCreatePersonality({
            name: "Ana",
            wikidata: { id: "Q1" },
        });

        expect(existing.wikidata).toBe("Q1");
        expect(existing.save).toHaveBeenCalled();
    });

    it("leaves a slug match unattached when the item is deleted", async () => {
        const existing: any = {
            _id: "p1",
            slug: "ana",
            wikidata: undefined,
            save: vi.fn(async () => undefined),
        };
        const { service } = makeFindService({
            bySlug: existing,
            checkItem: async () => ({ status: "deleted", props: {} }),
        });

        const result = await service.findOrCreatePersonality({
            name: "Ana",
            wikidata: { id: "Q1" },
        });

        expect(result).toBe(existing);
        expect(existing.wikidata).toBeUndefined();
        expect(existing.save).not.toHaveBeenCalled();
    });
});

const P1 = "64b0000000000000000000a1";

describe("MongoPersonalityService.update", () => {
    const storedDoc = () => ({
        _id: P1,
        name: "Geraldo Castro",
        slug: "geraldo-castro",
        description: "Radialista",
        wikidata: "Q142068353",
        isHidden: false,
    });

    function makeUpdateService(
        checkItem?: (...a: any[]) => Promise<any>,
        holder: any = null
    ) {
        const stored = storedDoc();
        const model: any = {
            findOne: vi.fn((filter: any) => ({
                lean: async () =>
                    filter._id === P1 && filter.isDeleted === false
                        ? { ...stored }
                        : null,
            })),
            findOneAndUpdate: vi.fn((_f: any, update: any) => ({
                lean: async () => ({ ...stored, ...update.$set }),
            })),
        };
        // loadCreatableItem's in-use lookup (no .lean())
        const inUseLookup = vi.fn(async (..._a: any[]) => holder);
        const history = {
            getHistoryParams: vi.fn((...args: any[]) => args),
            createHistory: vi.fn(async () => undefined),
        };
        const wikidata = {
            checkItem: vi.fn(
                checkItem ??
                    (async () => ({ status: "ok", props: { name: "X" } }))
            ),
            clearCache: vi.fn(async () => undefined),
            fetchProperties: vi.fn(async () => ({ twitterAccounts: [] })),
        };
        const service = new MongoPersonalityService(
            { params: {}, query: {}, user: { _id: "admin" } } as any,
            model,
            { agreggateClassification: async () => [] } as any,
            history as any,
            wikidata as any,
            new UtilService()
        );
        (service as any).findHolderOfWikidata = inUseLookup;
        return { service, model, history, wikidata, inUseLookup };
    }

    it("writes the submitted name and keeps the slug", async () => {
        const { service, model } = makeUpdateService();

        await service.update(P1, { name: "Geraldo Castro Silva" });

        const update = model.findOneAndUpdate.mock.calls[0][1];
        expect(update.$set).toEqual({ name: "Geraldo Castro Silva" });
        expect(update.$set.slug).toBeUndefined();
    });

    it("records history with stored before/after values", async () => {
        const { service, history } = makeUpdateService();

        await service.update(P1, { description: "Radialista da Timbira FM" });

        const [, , , , after, before] = history.getHistoryParams.mock.calls[0];
        expect(before).toMatchObject({ description: "Radialista" });
        expect(after).toMatchObject({
            description: "Radialista da Timbira FM",
        });
    });

    it("validates a relink and clears both cache entries", async () => {
        const { service, wikidata } = makeUpdateService();

        await service.update(P1, { wikidata: "Q2" });

        expect(wikidata.checkItem).toHaveBeenCalledWith("Q2", "pt", {
            fresh: true,
        });
        expect(wikidata.clearCache).toHaveBeenCalledWith("Q142068353");
        expect(wikidata.clearCache).toHaveBeenCalledWith("Q2");
    });

    it("rejects a relink to a disallowed type", async () => {
        const { service, model } = makeUpdateService(async () => ({
            status: "not_allowed_type",
            props: {},
        }));

        await expect(
            service.update(P1, { wikidata: "Q101352" })
        ).rejects.toMatchObject({ status: 400 });
        expect(model.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("rejects a relink to an id another personality holds (409)", async () => {
        const { service, model, inUseLookup } = makeUpdateService(undefined, {
            _id: "other",
        });

        await expect(
            service.update(P1, { wikidata: "Q2" })
        ).rejects.toMatchObject({ status: 409 });
        expect(inUseLookup).toHaveBeenCalledWith("Q2", true);
        expect(model.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("allows a relink when the holder is the same personality", async () => {
        const { service, model } = makeUpdateService(undefined, {
            _id: P1,
        });

        await service.update(P1, { wikidata: "Q2" });

        expect(model.findOneAndUpdate).toHaveBeenCalled();
    });

    it("does not check or clear caches for an unchanged wikidata id", async () => {
        const { service, wikidata } = makeUpdateService();

        await service.update(P1, {
            name: "Geraldo C.",
            wikidata: "Q142068353",
        });

        expect(wikidata.checkItem).not.toHaveBeenCalled();
        expect(wikidata.clearCache).not.toHaveBeenCalled();
    });

    it("writes nothing and records no history when nothing changed", async () => {
        const { service, model, history } = makeUpdateService();

        await service.update(P1, { name: "Geraldo Castro" });

        expect(model.findOneAndUpdate).not.toHaveBeenCalled();
        expect(history.createHistory).not.toHaveBeenCalled();
    });

    it("404s when the personality is deleted before the write", async () => {
        const { service, model, history, wikidata } = makeUpdateService();
        model.findOneAndUpdate = vi.fn(() => ({ lean: async () => null }));

        await expect(
            service.update(P1, { wikidata: "Q2" })
        ).rejects.toMatchObject({ status: 404 });
        expect(wikidata.clearCache).not.toHaveBeenCalled();
        expect(history.createHistory).not.toHaveBeenCalled();
    });

    it("turns a duplicate-key error on the relink write into a 409", async () => {
        const { service, model, wikidata } = makeUpdateService();
        model.findOneAndUpdate = vi.fn(() => ({
            lean: async () => {
                throw { code: 11000 };
            },
        }));

        await expect(
            service.update(P1, { wikidata: "Q2" })
        ).rejects.toMatchObject({
            status: 409,
            response: { reason: "in_use" },
        });
        expect(wikidata.clearCache).not.toHaveBeenCalled();
    });

    it("404s for an id that is not an ObjectId, without querying", async () => {
        const { service, model } = makeUpdateService();

        await expect(
            service.update("6c0e2f9e-1d2b-4c1a-9a53-0d6b6b1f0f11", {
                name: "X",
            })
        ).rejects.toMatchObject({ status: 404 });
        expect(model.findOne).not.toHaveBeenCalled();
    });

    it("404s for an unknown personality", async () => {
        const { service } = makeUpdateService();

        await expect(
            service.update("64b0000000000000000000ff", { name: "X" })
        ).rejects.toMatchObject({ status: 404 });
    });
});

describe("MongoPersonalityService.getStored", () => {
    it("returns the stored fields and the Wikidata status", async () => {
        const model: any = {
            findOne: vi.fn(() => ({
                lean: async () => ({
                    _id: P1,
                    name: "Geraldo Castro",
                    description: "Radialista",
                    wikidata: "Q142068353",
                }),
            })),
        };
        const wikidata = {
            checkItem: vi.fn(async () => ({
                status: "deleted",
                props: { twitterAccounts: [] },
            })),
        };
        const service = new MongoPersonalityService(
            { params: {}, query: {} } as any,
            model,
            {} as any,
            {} as any,
            wikidata as any,
            new UtilService()
        );

        const result = await service.getStored(P1);

        expect(wikidata.checkItem).toHaveBeenCalledWith("Q142068353", "pt");
        expect(result).toEqual({
            _id: P1,
            name: "Geraldo Castro",
            description: "Radialista",
            wikidata: "Q142068353",
            wikidataStatus: "deleted",
            wikidataProvides: { name: false, description: false },
        });
    });

    it("404s for an id that is not an ObjectId, without querying", async () => {
        const findOne = vi.fn();
        const service = new MongoPersonalityService(
            { params: {}, query: {} } as any,
            { findOne } as any,
            {} as any,
            {} as any,
            {} as any,
            new UtilService()
        );

        await expect(
            service.getStored("6c0e2f9e-1d2b-4c1a-9a53-0d6b6b1f0f11")
        ).rejects.toMatchObject({ status: 404 });
        expect(findOne).not.toHaveBeenCalled();
    });
});

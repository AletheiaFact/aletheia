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

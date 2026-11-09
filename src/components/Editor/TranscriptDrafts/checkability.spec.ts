import { getCheckabilityBand } from "./checkability";

describe("getCheckabilityBand", () => {
    it.each([
        [0, "low"],
        [24, "low"],
        [25, "attention"],
        [60, "attention"],
        [61, "high"],
        [100, "high"],
    ])("puts %s in the %s band", (checkability, band) => {
        expect(getCheckabilityBand(checkability)).toBe(band);
    });

    it.each([undefined, null])("has no band for %s", (checkability) => {
        expect(getCheckabilityBand(checkability)).toBeNull();
    });
});

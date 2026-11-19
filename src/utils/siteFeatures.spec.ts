import { DEFAULT_ORGANIZATION, getSiteFeatures } from "./siteFeatures";

describe("getSiteFeatures", () => {
    it("keeps the AletheiaFact behaviour when the flags are not set", () => {
        expect(getSiteFeatures({})).toEqual({
            showCommittee: true,
            showAboutPage: true,
            organization: DEFAULT_ORGANIZATION,
        });
    });

    it("hides the committee and the about page when the flags are false", () => {
        const features = getSiteFeatures({
            committee: { show: false },
            about: { show: false },
        });

        expect(features.showCommittee).toBe(false);
        expect(features.showAboutPage).toBe(false);
    });

    it("uses the configured organization for the JSON-LD publisher", () => {
        const organization = {
            url: "https://alumia.aletheiafact.org",
            sameAs: ["https://www.instagram.com/example"],
        };

        expect(getSiteFeatures({ organization }).organization).toBe(
            organization
        );
    });
});

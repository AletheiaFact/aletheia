import { FeatureFlagService } from "./feature-flag.service";

describe("FeatureFlagService.isEnableClassificationMethodology", () => {
    const build = (featureFlagConfig: unknown, enabled = true) => {
        const configService = { get: vi.fn(() => featureFlagConfig) };
        const unleash = { isEnabled: vi.fn(() => enabled) };
        return {
            service: new FeatureFlagService(
                configService as any,
                unleash as any
            ),
            unleash,
        };
    };

    it("is false when Unleash is not configured", () => {
        const { service, unleash } = build(undefined);
        expect(service.isEnableClassificationMethodology()).toBe(false);
        expect(unleash.isEnabled).not.toHaveBeenCalled();
    });

    it("reads enable_classification_methodology from Unleash", () => {
        const { service, unleash } = build({ url: "x" }, true);
        expect(service.isEnableClassificationMethodology()).toBe(true);
        expect(unleash.isEnabled).toHaveBeenCalledWith(
            "enable_classification_methodology"
        );
    });
});

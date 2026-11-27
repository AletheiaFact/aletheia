import type { LocalConfig } from "../../config/localConfig.schema";

export type SiteOrganization = NonNullable<LocalConfig["organization"]>;

export const DEFAULT_ORGANIZATION: SiteOrganization = {
    url: "https://aletheiafact.org",
    sameAs: [
        "https://www.facebook.com/AletheiaFactorg-107521791638412",
        "https://www.instagram.com/aletheiafact",
    ],
};

/**
 * Resolves the optional deployment flags in localConfig. A flag that is not
 * set keeps the AletheiaFact behaviour, so a deployment only sets the flags
 * it wants to change.
 */
export const getSiteFeatures = (
    config: Pick<LocalConfig, "committee" | "about" | "organization">
) => ({
    showCommittee: config.committee?.show ?? true,
    showAboutPage: config.about?.show ?? true,
    organization: config.organization ?? DEFAULT_ORGANIZATION,
});

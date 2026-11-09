import { Image } from "./Badge";

export interface Organization {
    _id: string;
    name: string;
    slug: string;
    website?: string;
    logo: Image;
}

/** Logo as sent to the API: an Image document or a fresh api/image upload result. */
export type OrganizationLogoInput = Image | Record<string, unknown>;

export interface OrganizationInput {
    name: string;
    /** "" clears the website on update. */
    website?: string;
    logo?: OrganizationLogoInput;
}

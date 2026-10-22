import type { IOrganization } from "./organization.interface";

export type OrganizationCreateInput = {
    name: string;
    website?: string;
    logo: string;
};

export type OrganizationUpdateInput = Partial<OrganizationCreateInput>;

export type IOrganizationService = {
    create(input: OrganizationCreateInput): Promise<IOrganization>;
    /** Throws NotFoundException when the organization does not exist. */
    update(id: string, input: OrganizationUpdateInput): Promise<IOrganization>;
    /** Case-insensitive substring match on the name, logo populated. */
    search(name: string, limit: number): Promise<IOrganization[]>;
    /** Ids from `ids` that belong to existing, non-deleted organizations. */
    findExistingIds(ids: string[]): Promise<string[]>;
};

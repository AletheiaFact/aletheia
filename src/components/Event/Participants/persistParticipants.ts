import type { EventParticipantInput } from "../../../types/event";
import type {
    Organization,
    OrganizationInput,
    OrganizationLogoInput,
} from "../../../types/Organization";
import {
    isDraftDirty,
    newLogoFile,
    ParticipantDraft,
} from "./participantDrafts";

export interface ParticipantsPersistenceApi {
    /** Uploads files in one request; results come back in the same order. */
    uploadLogos(files: File[]): Promise<OrganizationLogoInput[]>;
    createOrganization(input: OrganizationInput): Promise<Organization>;
    updateOrganization(
        id: string,
        input: Partial<OrganizationInput>
    ): Promise<Organization>;
}

/**
 * Saves what the participants editor changed and returns the event payload:
 * 1. every new logo is uploaded in a single api/image call,
 * 2. new organizations are created and edited ones updated,
 * 3. untouched organizations are referenced as-is.
 * Order follows the editor rows.
 */
export const persistParticipants = async (
    drafts: ParticipantDraft[] = [],
    api: ParticipantsPersistenceApi
): Promise<EventParticipantInput[]> => {
    const draftsWithNewLogo = drafts.filter((draft) => newLogoFile(draft));
    const uploadedLogos = draftsWithNewLogo.length
        ? await api.uploadLogos(draftsWithNewLogo.map(newLogoFile))
        : [];
    const uploadedLogoByKey = new Map(
        draftsWithNewLogo.map((draft, index) => [
            draft.key,
            uploadedLogos[index],
        ])
    );

    const organizationIds = await Promise.all(
        drafts.map(async (draft) => {
            const logo = uploadedLogoByKey.get(draft.key);
            const name = draft.name.trim();
            const website = draft.website.trim();

            if (!draft.organization) {
                const created = await api.createOrganization({
                    name,
                    ...(website && { website }),
                    logo,
                });
                return created._id;
            }

            if (isDraftDirty(draft)) {
                await api.updateOrganization(draft.organization._id, {
                    name,
                    website,
                    ...(logo && { logo }),
                });
            }
            return draft.organization._id;
        })
    );

    return organizationIds.map((organization, order) => ({
        organization,
        order,
    }));
};

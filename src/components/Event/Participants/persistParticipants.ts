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

export interface PreparedParticipants {
    participants: EventParticipantInput[];
    /**
     * Saves edits to existing organizations. Call it only once the event is
     * saved: organizations are shared, so a failed event save must not
     * change them on every other event.
     */
    commitEdits: () => Promise<void>;
}

const organizationInput = (
    draft: ParticipantDraft,
    logo?: OrganizationLogoInput
) => {
    const website = draft.website.trim();
    return { name: draft.name.trim(), website, ...(logo && { logo }) };
};

/**
 * `createdByKey` should live as long as the form (useRef): it remembers the
 * organizations created by a previous attempt, so retrying after a failed
 * event save reuses them instead of hitting 409.
 */
export const persistParticipants = async (
    drafts: ParticipantDraft[] = [],
    api: ParticipantsPersistenceApi,
    createdByKey: Map<string, Organization> = new Map()
): Promise<PreparedParticipants> => {
    const resolved = drafts.map((draft) =>
        createdByKey.has(draft.key)
            ? { ...draft, organization: createdByKey.get(draft.key) }
            : draft
    );
    const toCreate = resolved.filter((draft) => !draft.organization);
    const toEdit = resolved.filter(isDraftDirty);

    const needLogoUpload = [...toCreate, ...toEdit].filter((draft) =>
        newLogoFile(draft)
    );
    const uploadedLogos = needLogoUpload.length
        ? await api.uploadLogos(needLogoUpload.map(newLogoFile))
        : [];
    const uploadedLogoByKey = new Map(
        needLogoUpload.map((draft, index) => [draft.key, uploadedLogos[index]])
    );

    await Promise.all(
        toCreate.map(async (draft) => {
            const { website, ...input } = organizationInput(
                draft,
                uploadedLogoByKey.get(draft.key)
            );
            const created = await api.createOrganization({
                ...input,
                ...(website && { website }),
            });
            createdByKey.set(draft.key, created);
        })
    );

    const participants = resolved.map((draft, order) => ({
        organization: (draft.organization ?? createdByKey.get(draft.key))._id,
        order,
    }));

    const commitEdits = async () => {
        await Promise.all(
            toEdit.map((draft) =>
                api.updateOrganization(
                    draft.organization._id,
                    organizationInput(draft, uploadedLogoByKey.get(draft.key))
                )
            )
        );
    };

    return { participants, commitEdits };
};

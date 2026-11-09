import type { UploadFile } from "../../ImageUpload";
import type { EventParticipant } from "../../../types/event";
import type { Organization } from "../../../types/Organization";

/**
 * One row of the participants editor. `organization` is the saved
 * organization the row points to (absent for an organization created in the
 * form); name/website/logo hold the values being edited.
 */
export interface ParticipantDraft {
    key: string;
    organization?: Organization;
    name: string;
    website: string;
    /** Empty or a single file, the shape ImageUpload works with. */
    logo: UploadFile[];
}

let keyCounter = 0;
const newKey = () => `draft-${++keyCounter}`;

const logoAsUploadFile = (organization: Organization): UploadFile[] =>
    organization.logo?.content
        ? [
              {
                  uid: organization.logo._id,
                  name: organization.name,
                  status: "done",
                  url: organization.logo.content,
              },
          ]
        : [];

export const draftFromOrganization = (
    organization: Organization
): ParticipantDraft => ({
    key: newKey(),
    organization,
    name: organization.name,
    website: organization.website ?? "",
    logo: logoAsUploadFile(organization),
});

export const createEmptyDraft = (): ParticipantDraft => ({
    key: newKey(),
    name: "",
    website: "",
    logo: [],
});

export const draftsFromParticipants = (
    participants: EventParticipant[] = []
): ParticipantDraft[] =>
    [...participants]
        .sort((a, b) => a.order - b.order)
        .map(({ organization }) => draftFromOrganization(organization));

export const newLogoFile = (draft: ParticipantDraft): File | undefined =>
    draft.logo[0]?.originFileObj;

export const isDraftDirty = (draft: ParticipantDraft): boolean =>
    !!draft.organization &&
    (draft.name.trim() !== draft.organization.name ||
        draft.website.trim() !== (draft.organization.website ?? "") ||
        !!newLogoFile(draft));

export const moveDraft = (
    drafts: ParticipantDraft[],
    index: number,
    offset: -1 | 1
): ParticipantDraft[] => {
    const target = index + offset;
    if (target < 0 || target >= drafts.length) {
        return drafts;
    }
    const moved = [...drafts];
    [moved[index], moved[target]] = [moved[target], moved[index]];
    return moved;
};

const isHttpUrl = (value: string) => {
    try {
        const { protocol } = new URL(value);
        return protocol === "http:" || protocol === "https:";
    } catch {
        return false;
    }
};

/**
 * react-hook-form validator: returns an i18n key for the first invalid row,
 * or true. Mirrors the API rules so errors show before anything is saved.
 */
export const validateParticipantDrafts = (
    drafts: ParticipantDraft[] = []
): true | string => {
    for (const draft of drafts) {
        if (!/[\p{L}\p{N}]/u.test(draft.name)) {
            return "events:organizationNameRequired";
        }
        if (!draft.logo.length) {
            return "events:organizationLogoRequired";
        }
        if (draft.website.trim() && !isHttpUrl(draft.website.trim())) {
            return "events:organizationWebsiteInvalid";
        }
    }
    const names = drafts.map(({ name }) => name.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
        return "events:organizationDuplicated";
    }
    return true;
};

/** Splits participants for the collapsed logo row (11 logos + "+N" tile). */
export const visibleParticipants = <T>(
    items: T[],
    maxVisible: number,
    expanded: boolean
): { visible: T[]; hiddenCount: number } => {
    if (expanded || items.length <= maxVisible) {
        return { visible: items, hiddenCount: 0 };
    }
    const visible = items.slice(0, maxVisible - 1);
    return { visible, hiddenCount: items.length - visible.length };
};

import type { Organization } from "../../../types/Organization";
import {
    createEmptyDraft,
    draftFromOrganization,
    draftsFromParticipants,
    isDraftDirty,
    moveDraft,
    validateParticipantDrafts,
    visibleParticipants,
} from "./participantDrafts";

const organization = {
    _id: "a",
    name: "Org A",
    slug: "org-a",
    logo: { _id: "img", content: "https://bucket/a.png" },
} as Organization;

const validDraft = () => ({
    ...createEmptyDraft(),
    name: "Nova Org",
    logo: [{ uid: "1", name: "logo.png" }],
});

describe("participantDrafts", () => {
    it("builds drafts from saved participants in display order", () => {
        const second = { ...organization, _id: "b", name: "Org B" };
        const drafts = draftsFromParticipants([
            { organization: second, order: 1 },
            { organization, order: 0 },
        ]);

        expect(drafts.map(({ name }) => name)).toEqual(["Org A", "Org B"]);
        expect(drafts[0].logo).toEqual([
            {
                uid: "img",
                name: "Org A",
                status: "done",
                url: "https://bucket/a.png",
            },
        ]);
    });

    it("detects edits on existing organizations only", () => {
        const draft = draftFromOrganization(organization);

        expect(isDraftDirty(draft)).toBe(false);
        expect(isDraftDirty({ ...draft, name: "Org A2" })).toBe(true);
        expect(isDraftDirty({ ...draft, website: "https://a.org" })).toBe(true);
        expect(isDraftDirty(validDraft())).toBe(false);
    });

    it("moves rows within bounds", () => {
        const drafts = [validDraft(), validDraft()];

        expect(moveDraft(drafts, 0, 1)).toEqual([drafts[1], drafts[0]]);
        expect(moveDraft(drafts, 0, -1)).toBe(drafts);
        expect(moveDraft(drafts, 1, 1)).toBe(drafts);
    });

    describe("validateParticipantDrafts", () => {
        it("accepts valid rows and an empty list", () => {
            expect(validateParticipantDrafts([validDraft()])).toBe(true);
            expect(validateParticipantDrafts(undefined)).toBe(true);
        });

        it("requires a name with a letter or digit and a logo", () => {
            expect(
                validateParticipantDrafts([{ ...validDraft(), name: "!!" }])
            ).toBe("events:organizationNameRequired");
            expect(
                validateParticipantDrafts([{ ...validDraft(), logo: [] }])
            ).toBe("events:organizationLogoRequired");
        });

        it("rejects non-http websites and duplicated names", () => {
            expect(
                validateParticipantDrafts([
                    { ...validDraft(), website: "javascript:alert(1)" },
                ])
            ).toBe("events:organizationWebsiteInvalid");
            expect(
                validateParticipantDrafts([
                    validDraft(),
                    { ...validDraft(), name: " nova org " },
                ])
            ).toBe("events:organizationDuplicated");
        });
    });

    describe("visibleParticipants", () => {
        const items = Array.from({ length: 22 }, (_, index) => index);

        it("shows everything up to the limit", () => {
            expect(visibleParticipants(items.slice(0, 12), 12, false)).toEqual({
                visible: items.slice(0, 12),
                hiddenCount: 0,
            });
        });

        it("collapses to limit - 1 items plus a counter", () => {
            const { visible, hiddenCount } = visibleParticipants(
                items,
                12,
                false
            );
            expect(visible).toHaveLength(11);
            expect(hiddenCount).toBe(11);
        });

        it("shows everything when expanded", () => {
            expect(visibleParticipants(items, 12, true).hiddenCount).toBe(0);
        });
    });
});

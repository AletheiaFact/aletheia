import type { Organization } from "../../../types/Organization";
import {
    createEmptyDraft,
    draftFromOrganization,
    ParticipantDraft,
} from "./participantDrafts";
import {
    persistParticipants,
    ParticipantsPersistenceApi,
} from "./persistParticipants";

const organization = (id: string, overrides: Partial<Organization> = {}) =>
    ({
        _id: id,
        name: `Org ${id}`,
        slug: `org-${id}`,
        website: "https://example.org",
        logo: { _id: `img-${id}`, content: `https://bucket/${id}.png` },
        ...overrides,
    } as Organization);

const withNewLogo = (draft: ParticipantDraft, name: string) => ({
    ...draft,
    logo: [{ uid: name, name, originFileObj: { name } as File }],
});

const newDraft = (name: string, file?: string) => {
    const draft = { ...createEmptyDraft(), name, website: "" };
    return file ? withNewLogo(draft, file) : draft;
};

const mockApi = () => ({
    uploadLogos: vi.fn(async (files: File[]) =>
        files.map((file) => ({ FileURL: `https://bucket/${file.name}` }))
    ),
    createOrganization: vi.fn(async (input: { name: string }) =>
        organization(`new-${input.name}`, { name: input.name, website: "" })
    ),
    updateOrganization: vi.fn(async (id: string) => organization(id)),
});

const asApi = (api: ReturnType<typeof mockApi>) =>
    api as unknown as ParticipantsPersistenceApi;

describe("persistParticipants", () => {
    it("references untouched organizations without any API call", async () => {
        const api = mockApi();
        const drafts = [
            draftFromOrganization(organization("a")),
            draftFromOrganization(organization("b")),
        ];

        const { participants, commitEdits } = await persistParticipants(
            drafts,
            asApi(api)
        );
        await commitEdits();

        expect(participants).toEqual([
            { organization: "a", order: 0 },
            { organization: "b", order: 1 },
        ]);
        expect(api.uploadLogos).not.toHaveBeenCalled();
        expect(api.createOrganization).not.toHaveBeenCalled();
        expect(api.updateOrganization).not.toHaveBeenCalled();
    });

    it("uploads every new logo in a single call and maps them back by row", async () => {
        const api = mockApi();
        const created = { ...newDraft(" Nova Org ", "new.png") };
        const edited = withNewLogo(
            draftFromOrganization(organization("a")),
            "edited.png"
        );

        const { participants, commitEdits } = await persistParticipants(
            [created, edited],
            asApi(api)
        );

        expect(api.uploadLogos).toHaveBeenCalledTimes(1);
        expect(api.uploadLogos).toHaveBeenCalledWith([
            { name: "new.png" },
            { name: "edited.png" },
        ]);
        expect(api.createOrganization).toHaveBeenCalledWith({
            name: "Nova Org",
            logo: { FileURL: "https://bucket/new.png" },
        });
        expect(participants).toEqual([
            { organization: "new-Nova Org", order: 0 },
            { organization: "a", order: 1 },
        ]);

        // Shared organizations are only edited once the event is saved.
        expect(api.updateOrganization).not.toHaveBeenCalled();
        await commitEdits();
        expect(api.updateOrganization).toHaveBeenCalledWith("a", {
            name: "Org a",
            website: "https://example.org",
            logo: { FileURL: "https://bucket/edited.png" },
        });
    });

    it("updates text-only edits without re-uploading the logo", async () => {
        const api = mockApi();
        const draft = {
            ...draftFromOrganization(organization("a")),
            website: "",
        };

        const { commitEdits } = await persistParticipants([draft], asApi(api));
        await commitEdits();

        expect(api.uploadLogos).not.toHaveBeenCalled();
        expect(api.updateOrganization).toHaveBeenCalledWith("a", {
            name: "Org a",
            website: "",
        });
    });

    it("reuses organizations created by a failed attempt when retrying", async () => {
        const api = mockApi();
        const createdByKey = new Map<string, Organization>();
        const draft = newDraft("Nova Org", "new.png");

        await persistParticipants([draft], asApi(api), createdByKey);
        const retry = await persistParticipants(
            [draft],
            asApi(api),
            createdByKey
        );

        expect(api.createOrganization).toHaveBeenCalledTimes(1);
        expect(retry.participants).toEqual([
            { organization: "new-Nova Org", order: 0 },
        ]);
    });

    it("turns a rename after a failed attempt into an edit of the created organization", async () => {
        const api = mockApi();
        const createdByKey = new Map<string, Organization>();
        const draft = newDraft("Nova Org");

        await persistParticipants([draft], asApi(api), createdByKey);
        const { commitEdits } = await persistParticipants(
            [{ ...draft, name: "Nova Org Renomeada" }],
            asApi(api),
            createdByKey
        );
        await commitEdits();

        expect(api.createOrganization).toHaveBeenCalledTimes(1);
        expect(api.updateOrganization).toHaveBeenCalledWith("new-Nova Org", {
            name: "Nova Org Renomeada",
            website: "",
        });
    });

    it("returns an empty list when there are no participants", async () => {
        const { participants } = await persistParticipants(
            undefined,
            asApi(mockApi())
        );
        expect(participants).toEqual([]);
    });
});

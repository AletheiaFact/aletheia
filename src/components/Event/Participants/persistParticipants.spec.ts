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

const mockApi = (): ParticipantsPersistenceApi &
    {
        [K in keyof ParticipantsPersistenceApi]: ReturnType<typeof vi.fn>;
    } => ({
    uploadLogos: vi.fn(async (files: File[]) =>
        files.map((file) => ({ FileURL: `https://bucket/${file.name}` }))
    ),
    createOrganization: vi.fn(async (input) =>
        organization(`new-${input.name}`)
    ),
    updateOrganization: vi.fn(async (id) => organization(id)),
});

describe("persistParticipants", () => {
    it("references untouched organizations without any API call", async () => {
        const api = mockApi();
        const drafts = [
            draftFromOrganization(organization("a")),
            draftFromOrganization(organization("b")),
        ];

        const result = await persistParticipants(drafts, api);

        expect(result).toEqual([
            { organization: "a", order: 0 },
            { organization: "b", order: 1 },
        ]);
        expect(api.uploadLogos).not.toHaveBeenCalled();
        expect(api.createOrganization).not.toHaveBeenCalled();
        expect(api.updateOrganization).not.toHaveBeenCalled();
    });

    it("uploads every new logo in a single call and maps them back by row", async () => {
        const api = mockApi();
        const created = withNewLogo(
            { ...createEmptyDraft(), name: " Nova Org ", website: "" },
            "new.png"
        );
        const edited = withNewLogo(
            draftFromOrganization(organization("a")),
            "edited.png"
        );

        const result = await persistParticipants([created, edited], api);

        expect(api.uploadLogos).toHaveBeenCalledTimes(1);
        expect(api.uploadLogos).toHaveBeenCalledWith([
            { name: "new.png" },
            { name: "edited.png" },
        ]);
        expect(api.createOrganization).toHaveBeenCalledWith({
            name: "Nova Org",
            logo: { FileURL: "https://bucket/new.png" },
        });
        expect(api.updateOrganization).toHaveBeenCalledWith("a", {
            name: "Org a",
            website: "https://example.org",
            logo: { FileURL: "https://bucket/edited.png" },
        });
        expect(result).toEqual([
            { organization: "new-Nova Org", order: 0 },
            { organization: "a", order: 1 },
        ]);
    });

    it("updates text-only edits without re-uploading the logo", async () => {
        const api = mockApi();
        const draft = {
            ...draftFromOrganization(organization("a")),
            website: "",
        };

        await persistParticipants([draft], api);

        expect(api.uploadLogos).not.toHaveBeenCalled();
        expect(api.updateOrganization).toHaveBeenCalledWith("a", {
            name: "Org a",
            website: "",
        });
    });

    it("returns an empty list when there are no participants", async () => {
        expect(await persistParticipants(undefined, mockApi())).toEqual([]);
    });
});

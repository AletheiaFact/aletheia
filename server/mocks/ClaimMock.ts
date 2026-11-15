import { vi } from "vitest";
import type { ClaimDocument } from "../claim/mongo/schemas/claim.schema";
import type { IImage } from "../interfaces/claim-content.interface";
import type { PersonalityDocument } from "../personality/mongo/schemas/personality.schema";

/**
 * Mock factory for ClaimService matching actual service interface
 */
export const mockClaimService = () => ({
    getByPersonalityIdAndClaimSlug:
        vi.fn<() => Promise<Partial<ClaimDocument>>>(),
    getById: vi.fn<() => Promise<Partial<ClaimDocument>>>(),
    create: vi.fn<() => Promise<Partial<ClaimDocument>>>(),
    update: vi.fn<() => Promise<Partial<ClaimDocument>>>(),
    delete: vi.fn<() => Promise<void>>(),
    listAll: vi.fn<() => Promise<Partial<ClaimDocument>[]>>(),
    count: vi.fn<() => Promise<number>>(),
});

/**
 * Mock factory for the "ImageService" token (IImageService)
 */
export const mockImageService = () => ({
    getByDataHash: vi.fn<() => Promise<Partial<IImage>>>(),
    create: vi.fn<() => Promise<Partial<IImage>>>(),
    updateImageWithTopics: vi.fn<() => Promise<Partial<IImage>>>(),
});

/**
 * Mock factory for PersonalityService matching actual service interface
 */
export const mockPersonalityService = () => ({
    getPersonalityBySlug: vi.fn<() => Promise<Partial<PersonalityDocument>>>(),
    listAll: vi.fn<() => Promise<Partial<PersonalityDocument>[]>>(),
    getById: vi.fn<() => Promise<Partial<PersonalityDocument>>>(),
    create: vi.fn<() => Promise<Partial<PersonalityDocument>>>(),
    update: vi.fn<() => Promise<Partial<PersonalityDocument>>>(),
    delete: vi.fn<() => Promise<void>>(),
});

import { jest } from "@jest/globals";
import type { ClaimDocument } from "../claim/schemas/claim.schema";
import type { ImageDocument } from "../claim/types/image/schemas/image.schema";
import type { PersonalityDocument } from "../personality/mongo/schemas/personality.schema";

/**
 * Mock factory for ClaimService matching actual service interface
 */
export const mockClaimService = () => ({
    getByPersonalityIdAndClaimSlug:
        jest.fn<() => Promise<Partial<ClaimDocument>>>(),
    getById: jest.fn<() => Promise<Partial<ClaimDocument>>>(),
    create: jest.fn<() => Promise<Partial<ClaimDocument>>>(),
    update: jest.fn<() => Promise<Partial<ClaimDocument>>>(),
    delete: jest.fn<() => Promise<void>>(),
    listAll: jest.fn<() => Promise<Partial<ClaimDocument>[]>>(),
    count: jest.fn<() => Promise<number>>(),
});

/**
 * Mock factory for ImageService matching actual service interface
 */
export const mockImageService = () => ({
    getByDataHash: jest.fn<() => Promise<Partial<ImageDocument>>>(),
    create: jest.fn<() => Promise<Partial<ImageDocument>>>(),
    updateImageWithTopics: jest.fn<() => Promise<Partial<ImageDocument>>>(),
});

/**
 * Mock factory for PersonalityService matching actual service interface
 */
export const mockPersonalityService = () => ({
    getPersonalityBySlug:
        jest.fn<() => Promise<Partial<PersonalityDocument>>>(),
    listAll: jest.fn<() => Promise<Partial<PersonalityDocument>[]>>(),
    getById: jest.fn<() => Promise<Partial<PersonalityDocument>>>(),
    create: jest.fn<() => Promise<Partial<PersonalityDocument>>>(),
    update: jest.fn<() => Promise<Partial<PersonalityDocument>>>(),
    delete: jest.fn<() => Promise<void>>(),
});

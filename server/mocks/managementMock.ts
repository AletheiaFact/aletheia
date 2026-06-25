import { vi } from "vitest";

export const personalityServiceMock = {
    delete: vi.fn(),
};

export const claimServiceMock = {
    getByPersonalityId: vi.fn(),
    delete: vi.fn(),
};

export const claimReviewServiceMock = {
    findAllReviewsForCascadeDelete: vi.fn(),
    delete: vi.fn(),
};

export const mockManagementService = {
    deletePersonalityHierarchy: vi.fn(),
    deleteClaimHierarchy: vi.fn(),
};

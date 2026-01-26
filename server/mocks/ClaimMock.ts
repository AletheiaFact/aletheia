import { jest } from "@jest/globals";

export const mockClaimService = () => ({
    getByPersonalityIdAndClaimSlug: jest.fn<() => Promise<{ _id: string }>>(),
});

export const mockImageService = () => ({
    getByDataHash: jest.fn<() => Promise<{ _id: string; dataHash: string }>>(),
});

export const mockPersonalityService = () => ({
    getPersonalityBySlug: jest.fn<() => Promise<{ _id: string }>>(),
});

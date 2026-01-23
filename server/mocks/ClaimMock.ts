import { jest } from "@jest/globals";
import { Claim } from "../claim/schemas/claim.schema";

export const mockClaimService = () => ({
    getById: jest.fn(),
});

export const mockImageService = () => ({
    getByDataHash: jest.fn(),
});

export const mockPersonalityService = () => ({
    getPersonalityBySlug: jest.fn(),
});

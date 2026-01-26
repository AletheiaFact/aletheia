import { jest } from "@jest/globals";
import { IPersonalityService } from "interfaces/personality.service.interface";

export const mockClaimService = () => ({
    getByPersonalityIdAndClaimSlug: jest.fn<() => Promise<{ _id: string }>>(),
});

export const mockImageService = () => ({
    getByDataHash: jest.fn<() => Promise<{ _id: string; dataHash: string }>>(),
});

export const mockPersonalityService = (): Partial<
    jest.Mocked<IPersonalityService>
> => ({
    getPersonalityBySlug: jest.fn(),
});

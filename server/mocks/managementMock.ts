export const personalityServiceMock = {
    getById: jest.fn(),
    delete: jest.fn(),
};

export const claimServiceMock = {
    getByPersonalityId: jest.fn(),
    softDelete: jest.fn(),
};

export const claimReviewServiceMock = {
    findPublishedReviewsByClaimId: jest.fn(),
    delete: jest.fn(),
};

export const mockManagementService = {
    deletePersonalityHierarchy: jest.fn(),
    deleteClaimHierarchy: jest.fn(),
};

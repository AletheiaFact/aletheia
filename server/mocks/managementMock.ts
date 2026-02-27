export const personalityServiceMock = {
    delete: jest.fn(),
};

export const claimServiceMock = {
    getByPersonalityId: jest.fn(),
    delete: jest.fn(),
};

export const claimReviewServiceMock = {
    findPublishedReviewsByClaimId: jest.fn(),
    delete: jest.fn(),
};

export const mockManagementService = {
    deletePersonalityHierarchy: jest.fn(),
    deleteClaimHierarchy: jest.fn(),
};

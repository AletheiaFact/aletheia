export const mockEventModel = {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findOne: jest.fn(),
};

export const mockTopicModel = {
    aggregate: jest.fn(),
};

export const mockClaimReviewService = {
    getBatchCountsByTopics: jest.fn(),
};

export const mockTopicService = {
    findOrCreateTopic: jest.fn(),
};

export const mockCreateEventDto = {
    badge: "event-badge",
    name: "My Event",
    description: "My Event Description",
    location: "NYC",
    startDate: new Date("2026-01-05T00:00:00.000Z"),
    endDate: new Date("2026-01-10T00:00:00.000Z"),
    mainTopic: { name: "Climate", label: "Climate", wikidataId: "Q1" },
};

export const mockEventsService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findByHash: jest.fn(),
};

export const mockConfigService = {
    get: jest.fn().mockReturnValue("test-site-key"),
};

export const mockViewService = {
    render: jest.fn(),
};

export const mockRequest = {
    params: {
        namespace: "main"
    }
};

export const mockFeatureFlagService = {
    isEnableEventsFeature: jest.fn(),
};

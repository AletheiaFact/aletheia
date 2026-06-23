import { vi } from "vitest";

export const mockEventModel = {
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOne: vi.fn(),
};

export const mockTopicModel = {
    aggregate: vi.fn(),
};

export const mockClaimReviewService = {
    getBatchCountsByTopics: vi.fn(),
};

export const mockTopicService = {
    findOrCreateTopic: vi.fn(),
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
    create: vi.fn(),
    update: vi.fn(),
    findAll: vi.fn(),
    findByHash: vi.fn(),
};

export const mockConfigService = {
    get: vi.fn().mockReturnValue("test-site-key"),
};

export const mockViewService = {
    render: vi.fn(),
};

export const mockRequest = {
    params: {
        namespace: "main"
    }
};

export const mockFeatureFlagService = {
    isEnableEventsFeature: vi.fn(),
};

import { jest } from "@jest/globals";

/**
 * Mock Novu SDK instance
 */
export const mockNovu = () => ({
    subscribers: {
        identify: jest.fn<() => Promise<any>>().mockResolvedValue({
            data: { subscriberId: "sub-123" },
        }),
    },
    trigger: jest.fn<() => Promise<any>>().mockResolvedValue({
        data: { acknowledged: true, transactionId: "tx-123" },
    }),
    topics: {
        create: jest.fn<() => Promise<any>>().mockResolvedValue({
            data: { _id: "topic-id-123" },
        }),
        get: jest.fn<() => Promise<any>>().mockResolvedValue({
            data: { _id: "topic-id-123", key: "test-topic" },
        }),
        addSubscribers: jest.fn<() => Promise<any>>().mockResolvedValue({
            data: { succeeded: ["sub-123"] },
        }),
        removeSubscribers: jest.fn<() => Promise<any>>().mockResolvedValue({
            data: { succeeded: ["sub-123"] },
        }),
        getSubscriber: jest.fn<() => Promise<any>>().mockResolvedValue({
            data: { topicKey: "test-topic", externalSubscriberId: "sub-123" },
        }),
    },
});

/**
 * Mock ConfigService for notification tests
 */
export const mockNotificationConfigService = (configured = true) => ({
    get: jest.fn<(key: string) => any>().mockImplementation((key: string) => {
        const config = {
            "novu.api_key": configured ? "mock-novu-api-key" : undefined,
        };
        return config[key];
    }),
});


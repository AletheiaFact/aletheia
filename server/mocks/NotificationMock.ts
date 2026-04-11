import { vi } from "vitest";

/**
 * Mock Novu SDK instance
 */
export const mockNovu = () => ({
    subscribers: {
        identify: vi.fn<() => Promise<any>>().mockResolvedValue({
            data: { subscriberId: "sub-123" },
        }),
    },
    trigger: vi.fn<() => Promise<any>>().mockResolvedValue({
        data: { acknowledged: true, transactionId: "tx-123" },
    }),
    topics: {
        create: vi.fn<() => Promise<any>>().mockResolvedValue({
            data: { _id: "topic-id-123" },
        }),
        get: vi.fn<() => Promise<any>>().mockResolvedValue({
            data: { _id: "topic-id-123", key: "test-topic" },
        }),
        addSubscribers: vi.fn<() => Promise<any>>().mockResolvedValue({
            data: { succeeded: ["sub-123"] },
        }),
        removeSubscribers: vi.fn<() => Promise<any>>().mockResolvedValue({
            data: { succeeded: ["sub-123"] },
        }),
        getSubscriber: vi.fn<() => Promise<any>>().mockResolvedValue({
            data: { topicKey: "test-topic", externalSubscriberId: "sub-123" },
        }),
    },
});

/**
 * Mock ConfigService for notification tests
 */
export const mockNotificationConfigService = (configured = true) => ({
    get: vi.fn<(key: string) => any>().mockImplementation((key: string) => {
        const config = {
            "novu.api_key": configured ? "mock-novu-api-key" : undefined,
        };
        return config[key];
    }),
});


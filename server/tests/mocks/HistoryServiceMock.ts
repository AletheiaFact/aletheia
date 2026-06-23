import { vi } from "vitest";

export const HistoryServiceMock = {
    getHistoryParams: vi.fn((dataId, targetModel, user, type, latestChange, previousChange = null) => {
        return {
            targetId: dataId,
            targetModel,
            user: user?._id || user,
            type,
            details: {
                after: latestChange,
                before: previousChange,
            },
            date: new Date(),
        };
    }),
    createHistory: vi.fn().mockResolvedValue({}),
    getByTargetIdModelAndType: vi.fn().mockResolvedValue([]),
    getDescriptionForHide: vi.fn().mockResolvedValue(""),
};

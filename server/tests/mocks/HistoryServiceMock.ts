export const HistoryServiceMock = {
    getHistoryParams: jest.fn((dataId, targetModel, user, type, latestChange, previousChange = null) => {
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
    createHistory: jest.fn().mockResolvedValue({}),
    getByTargetIdModelAndType: jest.fn().mockResolvedValue([]),
    getDescriptionForHide: jest.fn().mockResolvedValue(""),
};

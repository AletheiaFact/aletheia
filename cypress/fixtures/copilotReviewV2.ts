export const mockReviewTaskUnassigned = {
    _id: "mock-review-task-id-1",
    data_hash: "mock-data-hash-unassigned",
    machine: {
        value: "unassigned",
        context: {
            reviewData: {
                usersId: [],
                summary: "",
                classification: "",
                reviewerId: null,
                crossCheckerId: null,
                reviewComments: [],
                crossCheckingComments: [],
                questions: [],
                report: "",
                verification: "",
                sources: [],
            },
            review: {
                personality: "",
                usersId: "",
                targetId: "",
                isPartialReview: false,
            },
        },
    },
    reportModel: "Fact-checking",
    reviewTaskType: "Claim",
};

export const mockReviewTaskAssigned = {
    _id: "mock-review-task-id-2",
    data_hash: "mock-data-hash-assigned",
    machine: {
        value: "assigned",
        context: {
            reviewData: {
                usersId: ["mock-user-id"],
                summary: "Test summary for Cypress",
                classification: "",
                reviewerId: null,
                crossCheckerId: null,
                reviewComments: [],
                crossCheckingComments: [],
                questions: ["Is this claim accurate?"],
                report: "<p>Preliminary analysis shows...</p>",
                verification: "",
                sources: [],
            },
            review: {
                personality: "mock-personality-id",
                usersId: "mock-user-id",
                targetId: "mock-target-id",
                isPartialReview: false,
            },
        },
    },
    reportModel: "Fact-checking",
    reviewTaskType: "Claim",
};

export const mockSessionList = [
    {
        _id: "session-1",
        title: "Initial review session",
        createdAt: "2025-01-15T10:00:00Z",
        updatedAt: "2025-01-15T12:30:00Z",
    },
    {
        _id: "session-2",
        title: "Follow-up analysis",
        createdAt: "2025-01-16T09:00:00Z",
        updatedAt: "2025-01-16T11:00:00Z",
    },
];

export const mockEmptySessionList = [];

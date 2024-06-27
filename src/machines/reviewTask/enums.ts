enum ReviewTaskEvents {
    init = "xstate.init",
    assignUser = "ASSIGN_USER",
    finishReport = "FINISH_REPORT",
    sendToCrossChecking = "SEND_TO_CROSS_CHECKING",
    submitCrossChecking = "SUBMIT_CROSS_CHECKING",
    sendToReview = "SEND_TO_REVIEW",
    reject = "REJECT",
    publish = "PUBLISH",
    draft = "SAVE_DRAFT",
    goback = "GO_BACK",
    addRejectionComment = "ADD_REJECTION_COMMENT",
    addComment = "ADD_COMMENT",
    submitComment = "SUBMIT_COMMENT",
    selectedReview = "SELECTED_REVIEW",
    selectedCrossChecking = "SELECTED_CROSS_CHECKING",
    reAssignUser = "RE_ASSIGN_USER",
    reset = "RESET",
    rejectRequest = "REJECT_REQUEST",
    assignRequest = "ASSIGN_REQUEST",
}

enum ReviewTaskStates {
    unassigned = "unassigned",
    assigned = "assigned",
    reported = "reported",
    selectReviewer = "selectReviewer",
    selectCrossChecker = "selectCrossChecker",
    crossChecking = "cross-checking",
    submitted = "submitted",
    rejected = "rejected",
    addCommentCrossChecking = "addCommentCrossChecking",
    published = "published",
    rejectedRequest = "rejectedRequest",
    assignedRequest = "assignedRequest",
}

enum CompoundStates {
    undraft = "undraft",
    draft = "draft",
}

enum ReportModelEnum {
    FactChecking = "Fact-checking",
    InformativeNews = "Informative News",
    Request = "Request",
}

enum ReviewTaskTypeEnum {
    Claim = "Claim",
    Source = "Source",
    VerificationRequest = "VerificationRequest",
}

export {
    ReviewTaskEvents,
    ReviewTaskStates,
    CompoundStates,
    ReportModelEnum,
    ReviewTaskTypeEnum,
};

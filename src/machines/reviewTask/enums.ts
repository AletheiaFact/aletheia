enum ReviewTaskEvents {
    init = "xstate.init",
    assignUser = "ASSIGN_USER",
    partialReview = "PARTIAL_REVIEW",
    fullReview = "FULL_REVIEW",
    finishReport = "FINISH_REPORT",
    submit = "SUBMIT",
    reject = "REJECT",
    publish = "PUBLISH",
    draft = "SAVE_DRAFT",
    goback = "GO_BACK",
    addRejectionComment = "ADD_REJECTION_COMMENT",
}

enum ReviewTaskStates {
    unassigned = "unassigned",
    assigned = "assigned",
    summarized = "summarized",
    reported = "reported",
    submitted = "submitted",
    rejected = "rejected",
    published = "published",
}

enum CompoundStates {
    undraft = "undraft",
    draft = "draft",
}

export { ReviewTaskEvents, ReviewTaskStates, CompoundStates };

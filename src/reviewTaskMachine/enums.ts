enum ReviewTaskEvents {
    init = "xstate.init",
    assignUser = "ASSIGN_USER",
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

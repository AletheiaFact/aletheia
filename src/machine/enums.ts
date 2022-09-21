enum ReviewTaskEvents {
    init = "xstate.init",
    assignUser = "ASSIGN_USER",
    finishReport = "FINISH_REPORT",
    submit = "SUBMIT",
    reject = "REJECT",
    publish = "PUBLISH",
    draft = "SAVE_DRAFT",
    goback = "GO_BACK",
}

enum ReviewTaskStates {
    unassigned = "unassigned",
    assigned = "assigned",
    reported = "reported",
    submitted = "submitted",
    published = "published",
}

enum CompoundStates {
    undraft = "undraft",
    draft = "draft",
}

enum ClassificationEnum {
    "not-fact" = 0,
    "false",
    "misleading",
    "unsustainable",
    "unverifiable",
    "exaggerated",
    "arguable",
    "trustworthy-but",
    "trustworthy",
}

enum Roles {
    Regular = "regular",
    FactChecker = "fact-checker",
    Admin = "admin",
}

export {
    ReviewTaskEvents,
    ReviewTaskStates,
    CompoundStates,
    ClassificationEnum,
    Roles,
};

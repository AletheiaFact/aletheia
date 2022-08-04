enum ReviewTaskEvents {
    init = "xstate.init",
    assignUser = "ASSIGN_USER",
    finishReport = "FINISH_REPORT",
    publish = "PUBLISH",
    draft = "SAVE_DRAFT",
    goback = "GO_BACK",
}

enum ReviewTaskStates {
    unassigned = "unassigned",
    assigned = "assigned",
    reported = "reported",
    published = "published",
}

enum CompoundStates {
    undraft = "undraft",
    draft = "draft",
}

enum ClassificationEnum {
    "not-fact",
    "true",
    "true-but",
    "arguable",
    "misleading",
    "false",
    "unsustainable",
    "exaggerated",
    "unverifiable",
}

export {
    ReviewTaskEvents,
    ReviewTaskStates,
    CompoundStates,
    ClassificationEnum,
};

enum ReviewTaskEvents {
    assignUser = "ASSIGN_USER",
    finishReport = "FINISH_REPORT",
    publish = "PUBLISH",
    draft = "SAVE_DRAFT"
}

enum ReviewTaskStates {
    unassigned = "unassigned",
    assigned = "assigned",
    reported = "reported",
    published = "published",
    undraft = "undraft",
    draft = "draft"
}

export { ReviewTaskEvents, ReviewTaskStates };

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

enum Status {
    Active = "active",
    Inactive = "inactive",
}

enum ContentModelEnum {
    Speech = "Speech",
    Image = "Image",
    Debate = "Debate",
}

export { ClassificationEnum, Roles, Status, ContentModelEnum };

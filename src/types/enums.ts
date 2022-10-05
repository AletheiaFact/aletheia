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

enum ContentModelEnum {
    Speech = "Speech",
    Twitter = "Twitter",
    Image = "Image",
}

export { ClassificationEnum, Roles, ContentModelEnum };

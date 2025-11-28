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
    Reviewer = "reviewer",
    Admin = "admin",
    SuperAdmin = "super-admin",
}

enum Status {
    Active = "active",
    Inactive = "inactive",
}

enum ContentModelEnum {
    Speech = "Speech",
    Image = "Image",
    Debate = "Debate",
    Unattributed = "Unattributed",
    History = "History",
}

export enum TargetModel {
    Claim = "Claim",
    Debate = "Debate",
    Personality = "Personality",
    ClaimReview = "ClaimReview",
    ReviewTask = "ReviewTask",
    Image = "Image",
}

enum CommentEnum {
    crossChecking = "cross-checking",
    review = "review",
}

enum SenderEnum {
    Assistant = "Assistant",
    User = "You",
}

export {
    ClassificationEnum,
    Roles,
    Status,
    ContentModelEnum,
    CommentEnum,
    SenderEnum,
};

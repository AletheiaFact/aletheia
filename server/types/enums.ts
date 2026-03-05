enum ContentModelEnum {
    Speech = "Speech",
    Image = "Image",
    Debate = "Debate",
    Unattributed = "Unattributed",
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

enum Environments {
    WATCH_DEV = "watch-dev",
    DEVELOPMENT = "development",
    PRODUCTION = "production",
    TEST_CI = "test.ci",
}

export { ContentModelEnum, Environments, ReportModelEnum, ReviewTaskTypeEnum };

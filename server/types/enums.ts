enum ContentModelEnum {
    Speech = "Speech",
    Image = "Image",
    Debate = "Debate",
    Interview = "Interview",
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

export { ContentModelEnum, ReportModelEnum, ReviewTaskTypeEnum };

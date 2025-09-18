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

enum ReceptionChannelEnum {
    Web = "Web",
    Instagram = "Instagram",
    Whatsapp = "Whatsapp",
}

export { ContentModelEnum, ReportModelEnum, ReviewTaskTypeEnum, ReceptionChannelEnum };

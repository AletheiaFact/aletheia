enum CreateClaimEvents {
    startSpeech = "START_SPEECH",
    startImage = "START_IMAGE",
    addPersonality = "ADD_PERSONALITY",
    noPersonality = "NO_PERSONALITY",
    publish = "PUBLISH",
}

enum CreateClaimStates {
    notStarted = "not_started",
    setupSpeech = "setup_speech",
    setupImage = "setup_image",
    personalityAdded = "personality_added",
    published = "published",
}

export { CreateClaimEvents, CreateClaimStates };

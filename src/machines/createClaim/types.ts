enum CreateClaimEvents {
    startSpeech = "START_SPEECH",
    startImage = "START_IMAGE",
    addPersonality = "ADD_PERSONALITY",
    savePersonality = "SAVE_PERSONALITY",
    noPersonality = "NO_PERSONALITY",
    persist = "PERSIST",
}

enum CreateClaimStates {
    notStarted = "not_started",
    setupSpeech = "setup_speech",
    setupImage = "setup_image",
    personalityAdded = "personality_added",
    persisted = "persisted",
}

export { CreateClaimEvents, CreateClaimStates };

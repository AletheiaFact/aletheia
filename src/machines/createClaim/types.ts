enum CreateClaimEvents {
    startSpeech = "START_SPEECH",
    startImage = "START_IMAGE",
    startDebate = "START_DEBATE",
    startUnattributed = "UNATTRIBUTED",
    addPersonality = "ADD_PERSONALITY",
    removePersonality = "REMOVE_PERSONALITY",
    savePersonality = "SAVE_PERSONALITY",
    noPersonality = "NO_PERSONALITY",
    persist = "PERSIST",
}

enum CreateClaimStates {
    notStarted = "not_started",
    setupSpeech = "setup_speech",
    setupImage = "setup_image",
    setupDebate = "setup_debate",
    personalityAdded = "personality_added",
    persisted = "persisted",
}

export { CreateClaimEvents, CreateClaimStates };

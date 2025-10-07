export enum SeverityEnum {
    "low_1",
    "low_2",
    "low_3",
    "medium_1",
    "medium_2",
    "medium_3",
    "high_1",
    "high_2",
    "high_3",
    "critical"
}

export enum VerificationRequestStatus {
    PRE_TRIAGE = "Pre Triage",
    IN_TRIAGE = "In Triage",
    POSTED = "Posted",
    DECLINED = "Declined",
}

export enum VerificationRequestSourceChannel {
    Website = "Web",
    Instagram = "instagram",
    Whatsapp = "whatsapp",
    Telegram = "telegram",
    AutomatedMonitoring = "automated_monitoring",
}

export enum VerificationRequestStateMachineStates {
    REQUESTING = 'requesting',
    CREATING = 'creating',
    EMBEDDING = 'embedding',
    IDENTIFYING_DATA = 'identifyingData',
    IDENTIFYING_PERSONALITY = 'identifyingPersonality',
    IDENTIFYING_PERSONALITY_IMPACT = 'identifyingPersonalityImpact',
    IDENTIFYING_PERSONALITY_AREA = 'identifyingPersonalityArea',
    DEFINING_TOPICS = 'definingTopics',
    DEFINING_IMPACT_AREA = 'definingImpactArea',
    DEFINING_SEVERITY = 'definingSeverity',
    SIMILARITY_RESEARCH = 'similarityResearch',
    FINISHED = 'finished',
}

export enum VerificationRequestStateMachineEvents {
    REQUEST = 'request',
    PRE_TRIAGE = 'preTriage',
    CREATE = 'create',
    EMBED = 'embed',
    IDENTIFY_DATA = 'identifyData',
    DEFINE_TOPICS = 'defineTopics',
    DEFINE_IMPACT_AREA = 'defineImpactArea',
    DEFINE_SEVERITY = 'defineSeverity',
}

export const VerificationRequestMessages = {
    DESCRIPTIONS: {
        DEFAULT: 'default',
        CREATING: 'Verification is being created on the database',
        REQUESTING: 'Verification is being requested',
        REQUESTED: 'Verification has been requested',
        EMBED: 'Verification is being embedded',
        IDENTIFY_DATA: 'Verification is being identified data',
        REVIEWING: 'Verification is being reviewed.',
        FINISHED: 'Verification has been finished.',
        CANCELLING: 'Verification is being cancelled. Status changes to Cancelled.',
        CANCELLED: 'Verification has been cancelled.',
        ERROR:
            'An unhandled error occurred on any of the steps of the request process.\n\nShould notify all entities associated and to inner channels.',
    },
    ERRORS: {
        LOCATION_SERVICE_PROVIDER_OR_USER_NOT_FOUND: 'Location, Service, Provider or User not  found.',
    },
}
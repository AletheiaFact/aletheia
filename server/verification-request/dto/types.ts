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

export enum VerificationRequestStateMachineStates {
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
    CREATE = 'create',
}
  

export const VerificationRequestMessages = {
    DESCRIPTIONS: {
        REQUESTING: 'Encounter is being requested',
        REQUESTED: 'Encounter has been requested',
        SCREENING_PATIENT: 'Encounter patient data is being screened',
        REQUESTING_REVIEW: 'Encounter is being set for requiring review',
        WAITING_REVIEW: 'Encounter needs review before being assigned a provider',
        REVIEWING: 'Encounter is being reviewed.',
        ASSIGNING_PROVIDER: 'Provider is being assigned to the encounter',
        AUTO_ASSIGNING_PROVIDER: 'Provider is being auto assigned',
        PLANNING:
        'Encounter has been requested to be planned.\n\nRequest a creation for a encounter on the encounter service database',
        PLANNED: 'Encounter has been planned.',
        UPDATING: 'Updating encounter. Currently used for signing and cancelling. Keeping for backwards compatibility.',
        EDITING: 'Editing encounter. This updates the non required fields available of the encounter.',
        DELETING: 'Encounter is being deleted.\n\n deleted value will be set to true',
        ACKNOWLEDGED: 'Encounter has been acknowledged.',
        ACKNOWLEDGING: 'Encounter is being acknowledged. Status changes to Acknowledged',
        STARTING: 'Encounter is being started. Status changes to In progress.',
        IN_PROGRESS: 'Encounter is in progress.',
        SIGNING: 'Encounter is being signed. Status changes to Finished.',
        FINISHED: 'Encounter has been finished.',
        CANCELLING: 'Encounter is being cancelled. Status changes to Cancelled.',
        CANCELLED: 'Encounter has been cancelled.',
        ERROR:
        'An unhandled error occurred on any of the steps of the request process.\n\nShould notify all entities associated and to inner channels.',
    },
    ERRORS: {
        LOCATION_SERVICE_PROVIDER_OR_USER_NOT_FOUND: 'Location, Service, Provider or User not  found.',
    },
}
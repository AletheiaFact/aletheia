export type ActingAs =
    | "teacher"
    | "researcher"
    | "student"
    | "professional"
    | "organization"
    | "other";

export interface FormState {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    uf: string;
    country: string;
    actingAs: ActingAs | "";
    institution: string;
    role: string;
    interestAreas: string[];
    contributionTypes: string[];
    availability: string[];
    priorExperience: string;
    motivation: string;
    consentData: boolean;
    consentComms: boolean;
}

export type ListField = "interestAreas" | "contributionTypes" | "availability";

export const INITIAL_STATE: FormState = {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    uf: "",
    country: "Brasil",
    actingAs: "",
    institution: "",
    role: "",
    interestAreas: [],
    contributionTypes: [],
    availability: [],
    priorExperience: "",
    motivation: "",
    consentData: false,
    consentComms: false,
};

export const STEP_KEYS = ["personal", "profile", "contribution", "consent"] as const;
export const STEP_FIELD_COUNTS = [6, 3, 5];
export const MOTIVATION_MAX_LENGTH = 500;

export const ACTING_AS_OPTIONS: ActingAs[] = [
    "teacher",
    "researcher",
    "student",
    "professional",
    "organization",
    "other",
];

export const INTEREST_AREA_OPTIONS = [
    "research",
    "mediaEducation",
    "communication",
    "technology",
    "regionalOutreach",
];

export const CONTRIBUTION_OPTIONS = [
    "factChecking",
    "workshops",
    "contentProduction",
    "softwareDevelopment",
    "institutionalPartnerships",
    "methodologicalSupport",
];

export const AVAILABILITY_OPTIONS = ["morning", "afternoon", "evening", "weekends"];

export const COUNTRY_OPTIONS = ["Brasil", "Portugal", "Outro"];

export const REQUIRED_FIELDS_BY_STEP: Record<number, (keyof FormState)[]> = {
    0: ["fullName", "email", "phone", "city", "uf", "country"],
    1: ["actingAs"],
    2: ["interestAreas", "contributionTypes", "availability", "motivation"],
    3: ["consentData", "consentComms"],
};

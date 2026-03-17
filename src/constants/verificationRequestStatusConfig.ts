import colors from "../styles/colors";

export const VERIFICATION_STATUS_CONFIG = {
    Posted: {
        color: colors.low,
        labelKey: "POSTED",
    },
    "In Triage": {
        color: colors.medium,
        labelKey: "IN_TRIAGE",
    },
    "Pre Triage": {
        color: colors.neutralSecondary,
        labelKey: "PRE_TRIAGE",
    },
    Declined: {
        color: colors.error,
        labelKey: "DECLINED",
    },
} as const;

export type VerificationStatus = keyof typeof VERIFICATION_STATUS_CONFIG;

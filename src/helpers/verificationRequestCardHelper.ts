import { useTranslations } from "next-intl";
import {
    VERIFICATION_STATUS_CONFIG,
    VerificationStatus,
} from "../constants/verificationRequestStatusConfig";
import colors from "../styles/colors";
import { SeverityLevel } from "../types/VerificationRequest";
import { TranslationFn } from "../types/Translations";

export const SEVERITY_COLOR_MAP: Record<SeverityLevel, string> = {
    low: colors.low,
    medium: colors.medium,
    high: colors.high,
    critical: colors.critical,
};

export const getSeverityLabel = (
    severity: string,
    tVerificationRequest: TranslationFn,
    tClaimForm: TranslationFn
): string => {
    if (!severity || severity === "N/A") return tClaimForm("noAnswer");

    const [label, level] = severity.split("_");

    return tVerificationRequest(`priority.${label}`, {
        level: level,
    });
};

export const getSeverityColor = (severity: string): string => {
    if (!severity || severity === "N/A") return colors.neutralSecondary;

    const severityStr = String(severity).toLowerCase();
    const levels: SeverityLevel[] = ["critical", "high", "medium", "low"];
    const matchedLevel = levels.find((level) => severityStr.startsWith(level));

    return SEVERITY_COLOR_MAP[matchedLevel] || colors.neutralSecondary;
};

export const truncateUrl = (url: string) => {
    try {
        if (!url || typeof url !== "string") return url;

        const { hostname, pathname } = new URL(url);
        const maxLength = 30;
        const shortPath =
            pathname.length > maxLength
                ? `${pathname.substring(0, maxLength)}...`
                : pathname;
        return `${hostname}${shortPath}`;
    } catch (error) {
        console.warn("Invalid URL for truncation:", url, error);
        return url;
    }
};

export const getStatusStyles = (status: string) => {
    const tVerificationRequest = useTranslations("verificationRequest");
    const config = VERIFICATION_STATUS_CONFIG[status as VerificationStatus];

    if (!config) return { color: colors.neutral, label: status };

    return {
        color: config.color,
        label: tVerificationRequest(`${config.labelKey}`),
    };
};

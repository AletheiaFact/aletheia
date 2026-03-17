import { VERIFICATION_STATUS_CONFIG, VerificationStatus } from "../constants/verificationRequestStatusConfig";
import colors from "../styles/colors";
import { SeverityLevel } from "../types/VerificationRequest";
import { TFunction } from "i18next";

export const SEVERITY_COLOR_MAP: Record<SeverityLevel, string> = {
  low: colors.low,
  medium: colors.medium,
  high: colors.high,
  critical: colors.critical,
};

export const getSeverityLabel = (severity: string, t: TFunction): string => {
  if (!severity || severity === "N/A") return t("claimForm:noAnswer");

  const [label, level] = severity.split("_");

  return t(`verificationRequest:priority.${label}`, {
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
    if (!url || typeof url !== 'string') return url;

    const { hostname, pathname } = new URL(url);
    const maxLength = 30;
    const shortPath = pathname.length > maxLength
      ? `${pathname.substring(0, maxLength)}...`
      : pathname;
    return `${hostname}${shortPath}`;
  } catch (error) {
    console.warn("Invalid URL for truncation:", url, error);
    return url;
  }
};

export const getStatusStyles = (status: string, t: TFunction) => {
    const config = VERIFICATION_STATUS_CONFIG[status as VerificationStatus];

    if (!config) return { color: colors.neutral, label: status };

    return {
        color: config.color,
        label: t(`verificationRequest:${config.labelKey}`)
    };
};

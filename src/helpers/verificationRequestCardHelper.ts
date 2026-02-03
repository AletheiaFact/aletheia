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
  if (!severity) return "N/A";

  const [label, level] = severity.split("_");

  return t(`verificationRequest:priority.${label}`, {
    level: level,
  });
};

export const getSeverityColor = (severity: string): string => {
  if (!severity) return colors.neutralSecondary;

  const severityStr = String(severity).toLowerCase();
  const levels: SeverityLevel[] = ["critical", "high", "medium", "low"];
  const matchedLevel = levels.find((level) => severityStr.startsWith(level));

  return SEVERITY_COLOR_MAP[matchedLevel];
};

export const truncateUrl = (url) => {
    try {
        const { hostname, pathname } = new URL(url);
        const maxLength = 30;
        const shortPath =
            pathname.length > maxLength
                ? `${pathname.substring(0, maxLength)}...`
                : pathname;
        return `${hostname}${shortPath}`;
    } catch (e) {
        return url;
    }
};

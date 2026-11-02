import colors from "../../../styles/colors";

export type CheckabilityBand = "low" | "attention" | "high";

/**
 * Band of a transcriber checkability score (0-100), the same bands as the
 * transcriber's operator page: below 25 low, 25 to 60 attention, above 60
 * high. The server applies no threshold; the bands only drive the badge.
 */
export const getCheckabilityBand = (
    checkability?: number | null
): CheckabilityBand | null => {
    if (checkability === undefined || checkability === null) {
        return null;
    }
    if (checkability < 25) {
        return "low";
    }
    return checkability <= 60 ? "attention" : "high";
};

export const CHECKABILITY_BAND_COLORS: Record<
    CheckabilityBand,
    { background: string; color: string }
> = {
    low: { background: colors.neutralSecondary, color: colors.white },
    attention: { background: colors.medium, color: colors.black },
    high: { background: colors.low, color: colors.white },
};

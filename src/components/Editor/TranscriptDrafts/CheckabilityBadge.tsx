import React from "react";
import { useTranslation } from "next-i18next";
import { Chip, Tooltip } from "@mui/material";

import {
    CHECKABILITY_BAND_COLORS,
    getCheckabilityBand,
} from "./checkability";

/**
 * Transcriber checkability score of a draft turn, as a percentage colored
 * by band. Renders nothing for a turn without a score.
 */
const CheckabilityBadge = ({
    checkability,
}: {
    checkability?: number | null;
}) => {
    const { t } = useTranslation();
    const band = getCheckabilityBand(checkability);
    if (!band) {
        return null;
    }
    return (
        <Tooltip title={t("debates:draftCheckabilityTooltip")}>
            <Chip
                size="small"
                label={t("debates:draftCheckabilityLabel", {
                    value: checkability,
                })}
                sx={{
                    ...CHECKABILITY_BAND_COLORS[band],
                    fontWeight: 600,
                }}
                data-cy="transcriptDraftCheckability"
                data-band={band}
            />
        </Tooltip>
    );
};

export default CheckabilityBadge;

import React from "react";
import { Tooltip } from "@mui/material";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import {
    getMethodology,
    toMethodologyLanguage,
} from "../../../lib/classification-methodology";
import { useClassificationMethodology } from "../../hooks/useClassificationMethodology";

interface MethodologyDisclaimerProps {
    methodology?: string;
    style?: React.CSSProperties;
}

const MethodologyDisclaimer = ({
    methodology,
    style = {},
}: MethodologyDisclaimerProps) => {
    const { t, i18n } = useTranslation();
    const resolved = getMethodology(useClassificationMethodology(methodology));
    const lang = toMethodologyLanguage(i18n.language);

    return (
        <Tooltip title={resolved.description[lang]}>
            <span
                data-cy="testMethodologyDisclaimer"
                style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 400,
                    textTransform: "none",
                    color: colors.blackSecondary,
                    ...style,
                }}
            >
                {t("claimReviewForm:methodologyLabel")}: {resolved.name[lang]}
            </span>
        </Tooltip>
    );
};

export default MethodologyDisclaimer;

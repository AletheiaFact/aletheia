import React from "react";
import { Stack } from "@mui/material";
import { useTranslation } from "next-i18next";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { trackUmamiEvent } from "../../../lib/umami";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import smoothScrollTo from "../../../utils/smoothScrollTo";
import localConfig from "../../../../config/localConfig";
import { getSiteFeatures } from "../../../utils/siteFeatures";

const HomeHeroActions = () => {
    const { t } = useTranslation();
    const { showCommittee } = getSiteFeatures(localConfig);

    return (
        <Stack className="home-header-actions">
            {showCommittee && (
                <AletheiaButton
                    endIcon={
                        <ArrowForwardIcon className="home-header-action-icon" />
                    }
                    type={ButtonType.darkBlue}
                    href="/committee-invitation"
                    onClick={() =>
                        trackUmamiEvent(
                            "cta-folder-committee-button",
                            "committee"
                        )
                    }
                    data-cy="testHomeHeaderSignUpButton"
                >
                    {t("home:committeeButton")}
                </AletheiaButton>
            )}
            <AletheiaButton
                endIcon={
                    <ArrowForwardIcon className="home-header-action-icon" />
                }
                type={ButtonType.outline}
                onClick={smoothScrollTo("latest-reviews")}
                data-cy="testHomeHeaderReviewsButton"
            >
                {t("home:homeHeaderViewReviewsButton")}
            </AletheiaButton>
        </Stack>
    );
};

export default HomeHeroActions;

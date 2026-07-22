import React from "react";
import { Stack } from "@mui/material";
import { useAtom } from "jotai";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { trackUmamiEvent } from "../../../lib/umami";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { useTranslations } from "next-intl";
import smoothScrollTo from "../../../utils/smoothScrollTo";

const HomeHeroActions = () => {
    const tHome = useTranslations("home");

    return (
        <Stack className="home-header-actions">
            <AletheiaButton
                endIcon={<ArrowForwardIcon className="home-header-action-icon" />}
                type={ButtonType.darkBlue}
                href="/committee-invitation"
                onClick={() => trackUmamiEvent("cta-folder-committee-button", "committee")}
                data-cy="testHomeHeaderSignUpButton"
            >
                {tHome("committeeButton")}
            </AletheiaButton>
            <AletheiaButton
                endIcon={<ArrowForwardIcon className="home-header-action-icon" />}
                type={ButtonType.outline}
                onClick={smoothScrollTo("latest-reviews")}
                data-cy="testHomeHeaderReviewsButton"
            >
                {tHome("homeHeaderViewReviewsButton")}
            </AletheiaButton>
        </Stack>
    );
};

export default HomeHeroActions;

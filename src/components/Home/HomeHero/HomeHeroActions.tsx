import React from "react";
import { Stack } from "@mui/material";
import { useAtom } from "jotai";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { isUserLoggedIn } from "../../../atoms/currentUser";
import { trackUmamiEvent } from "../../../lib/umami";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { useTranslations } from "next-intl";

const HomeHeroActions = () => {
    const tHome = useTranslations("home");
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    const handleClick = () => {
        if (isLoggedIn) {
            trackUmamiEvent("cta-folder-forum-button", "forum");
        } else {
            trackUmamiEvent("cta-registration-button", "registration");
        }
    };

    return (
        <Stack className="home-header-actions">
            <AletheiaButton
                endIcon={<ArrowForwardIcon className="home-header-action-icon" />}
                type={ButtonType.darkBlue}
                href={isLoggedIn ? "/committee-invitation" : "/sign-up"}
                onClick={handleClick}
                data-cy="testHomeHeaderSignUpButton"
            >
                {isLoggedIn
                    ? tHome("forumButton")
                    : tHome("createAccountButton")
                }
            </AletheiaButton>
            <AletheiaButton
                endIcon={<ArrowForwardIcon className="home-header-action-icon" />}
                type={ButtonType.outline}
                href="#latest-reviews"
                data-cy="testHomeHeaderReviewsButton"
            >
                {tHome("homeHeaderViewReviewsButton")}
            </AletheiaButton>
        </Stack>
    );
};

export default HomeHeroActions;

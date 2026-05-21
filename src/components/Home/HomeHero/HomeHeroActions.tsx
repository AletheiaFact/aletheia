import React, { useState } from "react";
import { Stack } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Button, { ButtonType } from "../../Button";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import { trackUmamiEvent } from "../../../lib/umami";
import ForumAlertModal from "../../Modal/ForumAlertModal";

const HomeHeroActions = () => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleHideModal = () => {
        setIsModalVisible(false);
    };

    const handleClick = () => {
        if (isLoggedIn) {
            setIsModalVisible(true);
            trackUmamiEvent("cta-folder-forum-button", "forum");
        } else {
            trackUmamiEvent("cta-registration-button", "registration");
        }
    };

    //The buttons need to be migrated to the new Aletheia button types.
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
            className="home-header-actions"
        >
            <Button
                type={ButtonType.lightBlue}
                href={!isLoggedIn ? "/sign-up" : undefined}
                onClick={handleClick}
                className="home-header-action-button home-header-action-primary"
                data-cy="testHomeHeaderSignUpButton"
            >
                {!isLoggedIn
                    ? t("home:createAccountButton")
                    : t("home:forumButton")
                }
                <ArrowForwardIcon className="home-header-action-icon" />
            </Button>
            <Button
                type={ButtonType.whiteBlue}
                href="#latest-reviews"
                className="home-header-action-button home-header-action-secondary"
                data-cy="testHomeHeaderReviewsButton"
            >
                {t("home:homeHeaderViewReviewsButton")}
                <ArrowForwardIcon className="home-header-action-icon" />
            </Button>
            {isModalVisible && (
                <ForumAlertModal open={isModalVisible} onCancel={handleHideModal} />
            )}
        </Stack>
    );
};

export default HomeHeroActions;

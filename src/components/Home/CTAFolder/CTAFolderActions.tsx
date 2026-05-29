import React from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../../lib/umami";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";

type CTAFolderActionsProps = {
    isLoggedIn: boolean;
    isHomeFolder: boolean;
};

const CTAFolderActions = ({ isLoggedIn, isHomeFolder }: CTAFolderActionsProps & { isHomeFolder?: boolean }) => {
    const { t } = useTranslation();
    const buttonType = isLoggedIn
        ? ButtonType.primary
        : isHomeFolder
            ? ButtonType.whiteOutline
            : ButtonType.outline;

    return (
        <Grid className="ctaButtonWrapper">
            {!isLoggedIn && (
                <AletheiaButton
                    type={isHomeFolder ? ButtonType.primary : ButtonType.white}
                    onClick={() => trackUmamiEvent("cta-banner-sign-up-button", "bannerSignUp")}
                    href="/sign-up"
                    data-cy="testCtaSignUpButton"
                >
                    {t("CTAFolder:signUpButton")}
                </AletheiaButton>
            )}
            <AletheiaButton
                type={buttonType}
                onClick={() => trackUmamiEvent("cta-banner-about-us-button", "bannerAboutUs")}
                href="/about"
                data-cy="testCtaAboutUsButton"
            >
                {t("CTAFolder:aboutUsButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default CTAFolderActions;

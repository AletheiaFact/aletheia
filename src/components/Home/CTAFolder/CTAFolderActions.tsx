import React from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../../lib/umami";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";

type CTAFolderActionsProps = {
    isLoggedIn: boolean;
    isHomeFolder?: boolean;
};

const getAboutButtonType = (isLoggedIn: boolean, isHomeFolder: boolean): ButtonType => {
    if (isLoggedIn) return ButtonType.primary;
    return isHomeFolder ? ButtonType.whiteOutline : ButtonType.outline;
};

const getSignUpButtonType = (isHomeFolder: boolean): ButtonType => {
    return isHomeFolder ? ButtonType.primary : ButtonType.white;
};

const CTAFolderActions = ({ isLoggedIn, isHomeFolder = false }: CTAFolderActionsProps) => {
    const { t } = useTranslation();

    const aboutButtonType = getAboutButtonType(isLoggedIn, isHomeFolder);
    const signUpButtonType = getSignUpButtonType(isHomeFolder);

    return (
        <Grid className="ctaButtonWrapper">
            {!isLoggedIn && (
                <AletheiaButton
                    type={signUpButtonType}
                    onClick={() => trackUmamiEvent("cta-banner-sign-up-button", "bannerSignUp")}
                    href="/sign-up"
                    data-cy="testCtaSignUpButton"
                >
                    {t("CTAFolder:signUpButton")}
                </AletheiaButton>
            )}

            <AletheiaButton
                type={aboutButtonType}
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

import React from "react";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../../lib/umami";

type CTAFolderActionsProps = {
    isLoggedIn: boolean;
};

const CTAFolderActions = ({ isLoggedIn }: CTAFolderActionsProps) => {
    const { t } = useTranslation();

    return (
        <Grid className="ctaButtonWrapper">
            {!isLoggedIn && (
                <Button
                    onClick={() => trackUmamiEvent("cta-banner-sign-up-button", "bannerSignUp")}
                    href="/sign-up"
                    className="ctaActionButtons ctaSignUpButton"
                    data-cy="testCtaSignUpButton"
                >
                    {t("CTAFolder:signUpButton")}
                </Button>
            )}
            <Button
                onClick={() => trackUmamiEvent("cta-banner-about-us-button", "bannerAboutUs")}
                href="/about"
                className="ctaActionButtons ctaAboutUsButton"
                data-cy="testCtaAboutUsButton"
            >
                {t("CTAFolder:aboutUsButton")}
            </Button>
        </Grid>
    );
};

export default CTAFolderActions;

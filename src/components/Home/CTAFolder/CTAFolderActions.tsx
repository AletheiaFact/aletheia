import React from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../../lib/umami";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";

type CTAFolderActionsProps = {
    isHomeFolder?: boolean;
};

const CTAFolderActions = ({ isHomeFolder }: CTAFolderActionsProps) => {
    const { t } = useTranslation();

    return (
        <Grid className="ctaButtonWrapper">
            <AletheiaButton
                type={
                    isHomeFolder ? ButtonType.whiteOutline : ButtonType.primary
                }
                onClick={() =>
                    trackUmamiEvent(
                        "cta-banner-about-us-button",
                        "bannerAboutUs"
                    )
                }
                href="/about"
                data-cy="testCtaAboutUsButton"
            >
                {t("CTAFolder:aboutUsButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default CTAFolderActions;

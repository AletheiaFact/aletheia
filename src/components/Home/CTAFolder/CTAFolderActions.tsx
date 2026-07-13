import React from "react";
import { Grid } from "@mui/material";
import { trackUmamiEvent } from "../../../lib/umami";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { useTranslations } from "next-intl";

type CTAFolderActionsProps = {
    isHomeFolder?: boolean;
};

const CTAFolderActions = ({ isHomeFolder }: CTAFolderActionsProps) => {
    const tCTAFolder = useTranslations("CTAFolder");

    return (
        <Grid className="ctaButtonWrapper">
            <AletheiaButton
                type={isHomeFolder ? ButtonType.whiteOutline : ButtonType.primary}
                onClick={() => trackUmamiEvent("cta-banner-about-us-button", "bannerAboutUs")}
                href="/about"
                data-cy="testCtaAboutUsButton"
            >
                {tCTAFolder("aboutUsButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default CTAFolderActions;

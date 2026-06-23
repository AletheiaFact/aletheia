import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { trackUmamiEvent } from "../../lib/umami";

import AletheiaButton, { ButtonType } from "../AletheiaButton";
import BannerStyle from "./Banner.style";
import AletheiaVideo from "../AletheiaVideo";

function Banner() {
    const { t } = useTranslation();

    return (
        <BannerStyle container>
            <Grid item xs={11} sm={10} xl={7} className="video-container">
                <AletheiaVideo />
            </Grid>
            <Grid item xs={10}>
                <AletheiaButton
                    onClick={() => {
                        trackUmamiEvent(
                            "banner-cta-registration-button",
                            "registration"
                        );
                    }}
                    type={ButtonType.whiteBlack}
                    href={"/sign-up"}
                    className="cta-registration-button"
                    size="large"
                >
                    {t("login:signup")}
                </AletheiaButton>
            </Grid>
        </BannerStyle>
    );
}

export default Banner;

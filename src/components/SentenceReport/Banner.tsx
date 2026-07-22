import { Grid } from "@mui/material";
import React from "react";
import { trackUmamiEvent } from "../../lib/umami";

import AletheiaButton, { ButtonType } from "../AletheiaButton";
import BannerStyle from "./Banner.style";
import AletheiaVideo from "../AletheiaVideo";
import { useTranslations } from "next-intl";

function Banner() {
    const tLogin = useTranslations("login");

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
                    {tLogin("signup")}
                </AletheiaButton>
            </Grid>
        </BannerStyle>
    );
}

export default Banner;

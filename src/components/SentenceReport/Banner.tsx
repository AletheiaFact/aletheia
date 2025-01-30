import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { trackUmamiEvent } from "../../lib/umami";

import Button, { ButtonType } from "../Button";
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
                <Button
                    onClick={() => {
                        trackUmamiEvent(
                            "banner-cta-registration-button",
                            "registration"
                        );
                    }}
                    type={ButtonType.whiteBlack}
                    href={"/sign-up"}
                    className="cta-registration-button"
                    style={{
                        height: "fit-content",
                        borderRadius: "10px",
                    }}
                >
                    <span>{t("CTARegistration:button")}</span>
                </Button>
            </Grid>
        </BannerStyle>
    );
}

export default Banner;

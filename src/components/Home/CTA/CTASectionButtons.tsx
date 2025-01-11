import React from "react";
import { Grid } from "@mui/material";
import { trackUmamiEvent } from "../../../lib/umami";
import Button, { ButtonType } from "../../Button";
import DonateButton from "../../Header/DonateButton";
import { useAppSelector } from "../../../store/store";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import localConfig from "../../../../config/localConfig";

const CTASectionButtons = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const mediumDevice = vw?.md;
    const smallDevice = vw?.sm;

    const handleClick = () => {
        trackUmamiEvent("home-header-cta-registration-button", "registration");
    };

    return (
        <Grid item xs={7} sm={6} className="CTA-button-container">
            {!isLoggedIn && (
                <Grid item xs={6}>
                    <Button
                        onClick={handleClick}
                        href={"/sign-up"}
                        type={ButtonType.white}
                        style={{
                            width: "100%",
                            padding: "0 20px",
                            fontWeight: 600,
                            fontSize:
                                mediumDevice && !smallDevice ? "12px" : "14px",
                        }}
                    >
                        {t("home:createAccountButton")}
                    </Button>
                </Grid>
            )}
            {!smallDevice && (
                <Grid item xs={5.5}>
                    {localConfig.header.donateButton.show ? (
                        <DonateButton
                            style={{ fontSize: mediumDevice ? "12px" : "14px" }}
                        />
                    ) : null}
                </Grid>
            )}
        </Grid>
    );
};

export default CTASectionButtons;

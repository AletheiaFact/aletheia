import React from "react";
import { Grid } from "@mui/material";
import DonateButton from "../../Header/DonateButton";
import { useAppSelector } from "../../../store/store";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import localConfig from "../../../../config/localConfig";
import CTAButton from "../CTAButton";
import { ButtonType } from "../../Button";

const CTASectionButtons = () => {
    const { vw } = useAppSelector((state) => state);
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    const mediumDevice = vw?.md;
    const smallDevice = vw?.sm;

    return (
        <Grid container
            xs={7}
            sm={6}
            className="CTA-button-container"
            style={{
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            {!smallDevice && (
                <Grid item xs={6}>
                    {localConfig.header.ctaButton.show && (
                        <CTAButton
                            type={ButtonType.white}
                            location="header"
                            isLoggedIn={isLoggedIn}
                            mediumDevice={mediumDevice}
                        />
                    )}
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

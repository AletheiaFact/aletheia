import { Grid } from "@mui/material"
import React from "react";
import { useTranslations } from "next-intl";

const CreateCTAButton = ({ children }) => {
    const tPersonalityCTA = useTranslations("personalityCTA");

    return (
        <Grid container
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginBottom: 16,
            }}
        >
            <p>
                <b>{tPersonalityCTA("header")}</b>
            </p>
            <p>{children}</p>
            <p>{tPersonalityCTA("footer")}</p>
        </Grid>
    );
};

export default CreateCTAButton;

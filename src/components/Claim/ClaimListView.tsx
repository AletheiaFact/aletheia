import { Grid } from "@mui/material"
import React from "react";
import ClaimList from "./ClaimList";
import { useTranslation } from "react-i18next";
import Paragraph from "../Paragraph";
// import SourceList from "../Source/SourceList";

const ClaimListView = () => {
    const { t } = useTranslation();
    return (
        <>
            <Grid container style={{ marginTop: "64px", justifyContent: "center" }} >
                <Grid item sm={7} md={7} lg={7}>
                    <h1 style={{ fontSize: 32 }}>
                        {t("claim:claimListTitle")}
                    </h1>
                    <Paragraph>{t("claim:claimListDescription")}</Paragraph>
                </Grid>

                {/* The sourcelist has been temporarily removed. */}
                {/* <Grid item sm={7} md={7} lg={6}>
                    <SourceList />
                </Grid> */}

                <Grid item style={{ margin: "0 20px" }} sm={7} md={7} lg={7}>
                    <ClaimList columns={6} personality={{ _id: null }} />
                </Grid>
            </Grid>
        </>
    );
};

export default ClaimListView;

import { Grid, Typography } from "@mui/material"
import React from "react";
import ClaimList from "./ClaimList";
import { useTranslation } from "react-i18next";
// import SourceList from "../Source/SourceList";

const ClaimListView = () => {
    const { t } = useTranslation();
    return (
        <>
            <Grid container style={{ marginTop: "64px", justifyContent: "center" }} >
                <Grid item xs={12} md={9.5}>
                    <Typography variant="h1" fontSize={32}>
                        {t("claim:claimListTitle")}
                    </Typography>
                    <Typography variant="body1">
                        {t("claim:claimListDescription")}
                    </Typography>
                </Grid>

                {/* The sourcelist has been temporarily removed. */}
                {/* <Grid item sm={7} md={7} lg={6}>
                    <SourceList />
                </Grid> */}

                <Grid item style={{ margin: "0 20px" }} xs={12} md={9.5}>
                    <ClaimList columns={6} personality={{ _id: null }} />
                </Grid>
            </Grid>
        </>
    );
};

export default ClaimListView;

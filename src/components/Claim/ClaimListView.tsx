import { Grid } from "@mui/material"
import React from "react";
import ClaimList from "./ClaimList";
import SourceList from "../Source/SourceList";
import { useTranslation } from "react-i18next";

const ClaimListView = () => {
    const { t } = useTranslation();
    return (
        <>
            <Grid container style={{ marginTop: "64px", justifyContent:"center" }}>
                <Grid item sm={7} md={7} lg={10.5}>
                    <h1 style={{ fontSize: 32 }}>
                        {t("claim:claimListTitle")}
                    </h1>
                </Grid>
                <Grid item sm={7} md={7} lg={6}>
                    <SourceList />
                </Grid>
                <Grid item style={{ margin: "0 20px" }} sm={7} md={7} lg={4}>
                    <ClaimList columns={12} personality={{ _id: null }} />
                </Grid>
            </Grid>
        </>
    );
};

export default ClaimListView;

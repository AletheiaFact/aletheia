import React from "react";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { Stats } from "./Stats";
import { Grid } from "@mui/material";

const HomeStats = ({ stats }) => {
    const { t } = useTranslation();

    return (
        <Grid
            container
            sm={9}
            md={8}
            xl={6}
            style={{
                color: colors.white,
                width: "100%",
                justifyContent: "space-between",
                display: "flex",
            }}
        >
            <Stats
                info={stats.personalities}
                title={t("home:statsPersonalities")}
                style={{ justifyContent: "flex-start" }}
            />
            <Stats info={stats.claims} title={t("home:statsClaims")} />
            <Stats
                info={stats.reviews}
                title={t("home:statsClaimReviews")}
                style={{ justifyContent: "flex-end" }}
            />
        </Grid>
    );
};

export default HomeStats;

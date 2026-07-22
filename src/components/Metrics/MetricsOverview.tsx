import React from "react";
import ReviewStats from "./ReviewStats";
import { Grid } from "@mui/material";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

const MetricsOverview = ({ stats }) => {
    const tMetrics = useTranslations("metrics");

    return (
        <Grid container justifyContent="center">
            <Grid
                item
                style={{
                    width: "100%",
                    color: colors.blackTertiary,
                }}
                xs={9}
            >
                {stats?.reviews && stats?.reviews.length > 0 ? (
                    <div>
                        <p
                            style={{
                                fontSize: 14,
                                lineHeight: "20px",
                                fontWeight: 700,
                                color: colors.blackSecondary,
                                marginBottom: 0,
                            }}
                        >
                            {tMetrics("headerTitle")}
                        </p>
                        <p
                            style={{
                                fontSize: 14,
                                lineHeight: "22px",
                                color: colors.blackSecondary,
                                marginBottom: "16px",
                            }}
                        >
                            {tMetrics("header")}
                        </p>
                    </div>
                ) : (
                    tMetrics("empytOverview")
                )}
                <ReviewStats stats={stats} countInTitle={true} type="line" />
            </Grid>
        </Grid>
    );
};

export default MetricsOverview;

import React from "react";
import ReviewStats from "./ReviewStats";
import { Grid } from "../Grid";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { spacing } from "../../styles";

const MetricsOverview = ({ stats }) => {
    const { t } = useTranslation();

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
                            {t("metrics:headerTitle")}
                        </p>
                        <p
                            style={{
                                fontSize: 14,
                                lineHeight: "22px",
                                color: colors.blackSecondary,
                                marginBottom: spacing.md,
                            }}
                        >
                            {t("metrics:header")}
                        </p>
                    </div>
                ) : (
                    t("metrics:empytOverview")
                )}
                <ReviewStats stats={stats} countInTitle={true} type="line" />
            </Grid>
        </Grid>
    );
};

export default MetricsOverview;

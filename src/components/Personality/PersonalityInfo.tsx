import React from "react";
import { Grid, Typography, Divider } from "@mui/material";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

interface PersonalityInfo {
    summarized: boolean;
    enableStats: boolean;
    personality: any;
    componentStyle: any; //adicionar tipo do componente style
    centralized: boolean;
    titleLevel: "h1" | "h2" | "h3" | "h4" | "h5";
}

export const PersonalityInfo = (props: PersonalityInfo) => {
    const { t } = useTranslation();
    const { componentStyle, summarized, personality, titleLevel, enableStats, centralized } =
        props;
    return (
        <Grid item
            xs={componentStyle.titleSpan}
            className="personality-card-content"
            style={{
                width: "50%",
                flex: "auto",
                display: 'flex',
                flexDirection: 'column',
                alignItems: centralized ? 'center' : 'flex-start',
                height: '100%',
            }}
        >
            {summarized && (
                <Typography variant="body1"
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 600,
                        marginBottom: 4,
                    }}
                >
                    {personality.name}
                </Typography>
            )}
            {!summarized && (
                <Typography
                    variant={titleLevel}
                    style={{
                        fontSize: "24px",
                        lineHeight: "32px",
                        fontWeight: 400,
                        marginBottom: 4,
                    }}
                >
                    {personality.name}
                </Typography>
            )}
            <Typography variant="body1"
                style={{
                    fontSize: summarized ? "10px" : "14px",
                    color: colors.blackSecondary,
                    marginBottom: 4,
                }}
            >
                {personality.description}
            </Typography>
            {summarized &&
                enableStats &&
                personality.stats?.total !== undefined && (
                    <Typography variant="body1"
                        style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            lineHeight: "15px",
                            color: colors.blackSecondary,
                            marginBottom: 10,
                        }}
                    >
                        <b>
                            {t("personality:headerReviewsTotal", {
                                totalReviews: personality.stats?.total,
                            })}
                        </b>
                    </Typography>
                )}
            {!summarized && personality.wikipedia && (
                <a
                    style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: colors.primary,
                        textDecoration: "underline",
                    }}
                    target="_blank"
                    href={personality.wikipedia}
                    rel="noreferrer"
                >
                    {t("personality:wikipediaPage")}
                </a>
            )}
            {!summarized && <Divider flexItem variant="middle" style={{ margin: "16px 0" }} />}
            {enableStats && (
                <Grid container>
                    {!summarized && (
                        <Grid container
                            style={{
                                flexDirection: 'column',
                                color: colors.black,
                                fontSize: "16px",
                                marginBottom: '25px',
                            }}
                        >
                            {personality?.claims?.length !== undefined && (
                                <span>
                                    {t("personality:headerClaimsTotal", {
                                        totalClaims: personality.claims.length,
                                    })}
                                </span>
                            )}
                            {personality.stats?.total !== undefined && (
                                <span>
                                    {t("personality:headerReviewsTotal", {
                                        totalReviews: personality.stats?.total,
                                    })}
                                </span>
                            )}
                        </Grid>
                    )}
                </Grid>
            )}
        </Grid>
    );
};

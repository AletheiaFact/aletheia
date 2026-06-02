import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { HomeHeroStatsProps } from "../../../types/Home";
import CountUp from "react-countup";

const HomeHeroStats = ({
    stats = { personalities: 0, claims: 0, reviews: 0 },
}: HomeHeroStatsProps) => {
    const { t } = useTranslation();

    const items = [
        {
            value: stats.personalities,
            label: t("home:statsPersonalities"),
        },
        {
            value: stats.claims,
            label: t("home:statsClaims"),
        },
        {
            value: stats.reviews,
            label: t("home:statsClaimReviews"),
        },
    ];

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            divider={
                <Box component="span" className="home-header-stats-divider" />
            }
            className="home-header-stats"
        >
            {items.map((item) => (
                <Stack
                    key={item.label}
                    direction="column"
                    alignItems="center"
                    spacing={1}
                    className="home-header-stats-item"
                >
                    <Typography
                        component="span"
                        className="home-header-stats-value"
                    >
                        <CountUp
                            start={0}
                            end={item.value}
                            duration={2}
                            separator="."
                        />
                    </Typography>
                    <Typography
                        component="span"
                        className="home-header-stats-label"
                    >
                        {item.label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    );
};

export default HomeHeroStats;

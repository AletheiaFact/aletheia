import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { HomeHeroStatsProps } from "../../../types/Home";
import CountUp from "react-countup"
import { useTranslations } from "next-intl";

const HomeHeroStats = ({ stats = { personalities: 0, claims: 0, reviews: 0 } }: HomeHeroStatsProps) => {
    const tHome = useTranslations("home");

    const items = [
        {
            value: stats.personalities,
            label: tHome("statsPersonalities"),
        },
        {
            value: stats.claims,
            label: tHome("statsClaims"),
        },
        {
            value: stats.reviews,
            label: tHome("statsClaimReviews"),
        },
    ];

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            divider={
                <Box
                    component="span"
                    className="home-header-stats-divider"
                />
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
                        <CountUp start={0} end={item.value} duration={2} separator="." />
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

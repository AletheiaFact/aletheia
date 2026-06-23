import Grid from "@mui/material/Grid";
import React from "react";
import HomeHeroTitle from "./HomeHeroTitle";
import HomeHeroActions from "./HomeHeroActions";
import HomeHeroFeatures from "./HomeHeroFeatures";
import HomeHeroStats from "./HomeHeroStats";
import HomeHeroStyle from "./HomeHero.style";
import { HomeHeroStatsProps } from "../../../types/Home";

const HomeHero = ({ stats }: HomeHeroStatsProps) => {
    return (
        <HomeHeroStyle container>
            <Grid
                item
                xs={12}
                container
                justifyContent="center"
                className="home-header-dark-section"
            >
                <Grid
                    item
                    xl={8}
                    lg={9}
                    md={10}
                    sm={11}
                    xs={12}
                    className="home-header-content"
                >
                    <HomeHeroTitle />
                    <HomeHeroActions />
                    <HomeHeroFeatures />
                </Grid>
            </Grid>
            <Grid item xs={12} className="home-header-stats-section">
                <HomeHeroStats stats={stats} />
            </Grid>
        </HomeHeroStyle>
    );
};

export default HomeHero;

import Grid from "@mui/material/Grid";
import React from "react";
import HomeHeroTitle from "./HomeHeroTitle";
import HomeHeroActions from "./HomeHeroActions";
import HomeHeroFeatures from "./HomeHeroFeatures";
import HomeHeroStyle from "./HomeHero.style";

const HomeHero = () => {
    return (
        <HomeHeroStyle container>
            <Grid item
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
        </HomeHeroStyle>
    );
};

export default HomeHero;

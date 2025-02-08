import Grid from "@mui/material/Grid";
import React from "react";
import CTASection from "../CTA/CTASection";
import HomeHeaderStyle from "./HomeHeader.style";
import HomeHeaderTitle from "./HomeHeaderTitle";
import HomeStats from "../HomeStats";
import HomeHeaderSearch from "./HomeHeaderSearch";

const HomeHeader = ({ stats }) => {
    return (
        <HomeHeaderStyle container>
            <Grid item
                xl={6}
                lg={8}
                sm={9}
                xs={12}
                className="home-header-content"
            >
                <HomeHeaderTitle />
                <CTASection />
            </Grid>
            <HomeStats stats={stats} />

            <HomeHeaderSearch />
        </HomeHeaderStyle>
    );
};

export default HomeHeader;

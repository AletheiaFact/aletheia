import React from "react";
import { Box, Grid } from "@mui/material";
import HomeJoinSectionStyle from "./HomeJoinSection.style";
import HomeJoinSectionContent from "./HomeJoinSectionContent";
import HomeJoinSectionBenefits from "./HomeJoinSectionBenefits";
import HomeJoinSectionShare from "./HomeJoinSectionShare";

type HomeJoinSectionProps = {
    href: string;
};

const HomeJoinSection = ({ href }: HomeJoinSectionProps) => {
    return (
        <Grid item xs={12}>
            <HomeJoinSectionStyle container>
                <Box className="home-join-band">
                    <Box className="home-join-inner">
                        <HomeJoinSectionContent />
                        <HomeJoinSectionBenefits />
                    </Box>
                </Box>
                <HomeJoinSectionShare href={href} />
            </HomeJoinSectionStyle>
        </Grid>
    );
};

export default HomeJoinSection;

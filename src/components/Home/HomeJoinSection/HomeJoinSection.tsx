import React from "react";
import { Box, Grid } from "@mui/material";
import HomeJoinSectionStyle from "./HomeJoinSection.style";
import HomeJoinSectionShare from "./HomeJoinSectionShare";
import CTAFolderAchievementsColumn from "../CTAFolder/CTAFolderAchievementsColumn";
import CTAFolderMainColumn from "../CTAFolder/CTAFolderMainColumn";

type HomeJoinSectionProps = {
    href: string;
};

const HomeJoinSection = ({ href }: HomeJoinSectionProps) => {
    return (
        <Grid item xs={12}>
            <HomeJoinSectionStyle container>
                <Box className="home-join-band">
                    <Box className="home-join-inner">
                        <CTAFolderMainColumn />
                        <CTAFolderAchievementsColumn />
                    </Box>
                </Box>
                <HomeJoinSectionShare href={href} />
            </HomeJoinSectionStyle>
        </Grid>
    );
};

export default HomeJoinSection;

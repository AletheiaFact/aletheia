import React from "react";
import { Box, Grid } from "@mui/material";
import HomeJoinSectionStyle from "./HomeJoinSection.style";
import HomeJoinSectionShare from "./HomeJoinSectionShare";
import CTAFolderAchievementsColumn from "../CTAFolder/CTAFolderAchievementsColumn";
import CTAFolderMainColumn from "../CTAFolder/CTAFolderMainColumn";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import { useAtom } from "jotai";

type HomeJoinSectionProps = {
    href: string;
};

const HomeJoinSection = ({ href }: HomeJoinSectionProps) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <Grid item xs={12}>
            <HomeJoinSectionStyle container $isLoggedIn={isLoggedIn}>
                <Box className="home-join-band">
                    <Box className="home-join-inner">
                        <CTAFolderMainColumn isLoggedIn={isLoggedIn} />
                        <CTAFolderAchievementsColumn />
                    </Box>
                </Box>
                <HomeJoinSectionShare href={href} />
            </HomeJoinSectionStyle>
        </Grid>
    );
};

export default HomeJoinSection;

import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Grid, List, ListItem, Typography } from "@mui/material"
import { useTranslations } from "next-intl";

const CTAFolderAchievementsColumn = () => {
    const tCTAFolder = useTranslations("CTAFolder");

    const achievements = [
        tCTAFolder("achievements1"),
        tCTAFolder("achievements2"),
        tCTAFolder("achievements3"),
        tCTAFolder("achievements4"),
    ];

    return (
        <Grid item className="ctaAchievementsColumn">
            <Typography
                variant="h3"
                className="ctaAchievementsTitle"
            >
                {tCTAFolder("aletheiaMoviment")}
            </Typography>
            <List className="ctaAchievementsList">
                {achievements.map((achievement) => (
                    <ListItem
                        key={achievement}
                        disablePadding
                        className="ctaAchievementsItem"
                    >
                        <CheckIcon
                            className="ctaAchievementsIcon"
                            aria-hidden
                        />
                        <Typography
                            variant="body1"
                            className="ctaAchievementsText"
                        >
                            {achievement}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Grid>
    );
};

export default CTAFolderAchievementsColumn;

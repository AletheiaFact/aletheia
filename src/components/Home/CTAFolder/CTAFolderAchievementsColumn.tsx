import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Grid, List, ListItemIcon, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";

const CTAFolderAchievementsColumn = () => {
    const { t } = useTranslation();
    const achievements = [
        t("CTAFolder:achievements1"),
        t("CTAFolder:achievements2"),
        t("CTAFolder:achievements3"),
        t("CTAFolder:achievements4"),
    ];

    return (
        <Grid item className="ctaAchievementsColumn">
            <Typography
                variant="h3"
                className="ctaAchievementsTitle"
            >
                {t("CTAFolder:aletheiaMoviment")}
            </Typography>
            <List className="ctaAchievementsList">
                {achievements.map((achievement) => (
                    <ListItemIcon
                        key={achievement}
                        className="ctaAchievementsItem"
                    >
                        <CheckIcon className="ctaAchievementsIcon" aria-hidden />
                        <Typography variant="body1">
                            {achievement}
                        </Typography>
                    </ListItemIcon>
                ))}
            </List>
        </Grid>
    );
};

export default CTAFolderAchievementsColumn;

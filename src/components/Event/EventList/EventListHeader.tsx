

import React from "react";
import { Box, Grid, Typography } from "@mui/material";

interface EventListHeaderProps {
    t: (key: string) => string;
}

const EventListHeader = ({ t }: EventListHeaderProps) => {
    return (
        <Grid item xs={11} sm={8}>
            <Box className="heroSectionBox">
                <Typography variant="h3" className="heroTitle">
                    {t("events:heroTitle")}
                </Typography>
                <Typography variant="body1" className="heroSubtitle">
                    {t("events:heroSubtitle")}
                </Typography>
            </Box>
        </Grid >
    );
};

export default EventListHeader;



import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const EventListHeader = () => {
    const tEvents = useTranslations("events");

    return (
        <Grid item xs={11} sm={8}>
            <Box className="heroSectionBox">
                <Typography variant="h3" className="heroTitle">
                    {tEvents("heroTitle")}
                </Typography>
                <Typography variant="body1" className="heroSubtitle">
                    {tEvents("heroSubtitle")}
                </Typography>
            </Box>
        </Grid >
    );
};

export default EventListHeader;

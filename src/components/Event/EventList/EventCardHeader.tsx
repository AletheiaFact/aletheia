import React from "react";
import { Grid, Typography } from "@mui/material";

interface EventCardHeaderProps {
    badge: string;
    location: string;
}

const EventCardHeader = ({ badge, location }: EventCardHeaderProps) => {
    return (
        <Grid item xs={12} className="EventCardHeader">
            <Typography variant="h2" className="EventCardBadge">
                {badge}
            </Typography>
            <Typography variant="body1" className="EventCardBody1">
                {location}
            </Typography>
        </Grid>
    );
};

export default EventCardHeader;

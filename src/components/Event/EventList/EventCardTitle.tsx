import React from "react";
import { Grid, Typography } from "@mui/material";

interface EventCardTitleProps {
    title: string;
}

const EventCardTitle = ({ title }: EventCardTitleProps) => {
    return (
        <Grid item xs={12}>
            <Typography variant="h1" className="EventCardTitle">
                {title}
            </Typography>
        </Grid>
    );
};

export default EventCardTitle;

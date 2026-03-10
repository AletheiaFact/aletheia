import React from "react";
import { Grid, Typography } from "@mui/material";
import colors from "../../../styles/colors";

interface EventCardTitleProps {
    title: string;
}

const EventCardTitle = ({ title }: EventCardTitleProps) => {
    return (
        <Grid item xs={12}>
            <Typography
                variant="h1"
                style={{
                    color: colors.primary,
                    fontSize: 24,
                    fontWeight: 600,
                }}
            >
                {title}
            </Typography>
        </Grid>
    );
};

export default EventCardTitle;

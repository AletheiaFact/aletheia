import React from "react";
import { Grid, Typography } from "@mui/material";

type StatsProps = {
    info: number,
    title: string
}

export const Stats = ({ info, title }: StatsProps) => {
    return (
        <Grid item
            className="statsContainer"
        >
            <Typography
                variant="h3"
                className="statsNumber"
            >
                {info}
            </Typography>
            <Typography
                variant="body1"
                className="statsTitle"
            >
                {title}
            </Typography>
        </Grid>
    );
};

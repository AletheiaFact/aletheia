import React from "react";
import { Grid, Typography } from "@mui/material";
import CountUp from "react-countup";

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
                <CountUp start={0} end={info} duration={2} separator="." />
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

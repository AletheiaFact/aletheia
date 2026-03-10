import React from "react";
import { Grid, Typography } from "@mui/material";
import colors from "../../../styles/colors";

interface EventCardHeaderProps {
    badge: string;
    location: string;
}

const EventCardHeader = ({ badge, location }: EventCardHeaderProps) => {
    return (
        <Grid item xs={12} display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography
                variant="h2"
                style={{
                    background: colors.lightTertiary,
                    color: colors.lightPrimary,
                    fontSize: 16,
                    fontWeight: 800,
                    padding: "4px 12px",
                    borderRadius: 4,
                }}
            >
                {badge}
            </Typography>
            <Typography
                variant="h2"
                style={{
                    color: colors.secondary,
                    fontSize: 16,
                }}
            >
                {location}
            </Typography>
        </Grid>
    );
};

export default EventCardHeader;

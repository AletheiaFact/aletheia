import React from "react";
import { Grid, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import colors from "../../../styles/colors";

interface EventCardDateRangeProps {
    startDate: Date;
    endDate: Date;
    locale: string;
}

const EventCardDateRange = ({ startDate, endDate, locale }: EventCardDateRangeProps) => {
    return (
        <Grid item xs={12} display="flex" gap={1}>
            <CalendarMonthIcon fontSize="small" style={{ color: colors.secondary }} />
            <Typography
                variant="body1"
                style={{
                    color: colors.secondary,
                    fontSize: 14,
                    marginTop: 2,
                }}
            >
                {`${new Date(startDate).toLocaleDateString(locale)} - ${new Date(endDate).toLocaleDateString(locale)}`}
            </Typography>
        </Grid>
    );
};

export default EventCardDateRange;

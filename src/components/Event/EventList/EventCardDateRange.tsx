import React from "react";
import { Grid, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import colors from "../../../styles/colors";
import { i18n } from "next-i18next";

interface EventCardDateRangeProps {
    startDate: Date;
    endDate: Date;
}

const EventCardDateRange = ({ startDate, endDate, }: EventCardDateRangeProps) => {
    const locale = i18n.language || "pt";
    return (
        <Grid item xs={12} display="flex" gap={1}>
            <CalendarMonthIcon fontSize="small" style={{ color: colors.secondary }} />
            <Typography variant="body1" className="EventCardBody1" >
                {`${new Date(startDate).toLocaleDateString(locale)} - ${new Date(endDate).toLocaleDateString(locale)}`}
            </Typography>
        </Grid>
    );
};

export default EventCardDateRange;

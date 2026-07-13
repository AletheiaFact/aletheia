import React from "react";
import { Box, Grid } from "@mui/material";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { EventStatus } from "../../../types/event";
import { useTranslations } from "next-intl";

interface EventFiltersProps {
    selectedStatus: EventStatus;
    onStatusChange: (status: EventStatus) => void;
}

const EventFilters = ({ selectedStatus, onStatusChange }: EventFiltersProps) => {
    const tEvents = useTranslations("events");
    const filterOptions = [
        { status: "all" as const, label: tEvents("filterAll") },
        { status: "happening" as const, label: tEvents("filterHappening") },
        { status: "upcoming" as const, label: tEvents("filterUpcoming") },
        { status: "finalized" as const, label: tEvents("filterFinished") },
    ];

    return (
        <Grid item xs={12} sm={8} display="flex" justifyContent="center" padding={2}>
            <Box className="EventFiltersBox">
                {filterOptions.map(({ status, label }) => (
                    <AletheiaButton
                        key={status}
                        data-cy={`testFiltersEvents${status}`}
                        type={selectedStatus === status ? ButtonType.whiteBlue : ButtonType.gray}
                        onClick={() => onStatusChange(status)}
                        rounded
                        style={{ padding: "clamp(10px, 2vw, 16px)", fontWeight: 600 }}
                    >
                        {label}
                    </AletheiaButton>
                ))}
            </Box>
        </Grid >
    );
};

export default EventFilters;

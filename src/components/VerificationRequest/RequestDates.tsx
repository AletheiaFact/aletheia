import React from "react";
import { Box, Typography } from "@mui/material";
import LocalizedDate from "../LocalizedDate";

interface RequestDatesProps {
    icon?: React.ReactNode;
    label: string;
    value: string;
}

export const RequestDates: React.FC<RequestDatesProps> = ({ icon, label, value }) => {
    const publicationDate = new Date(value);
    const isValidDate = !isNaN(publicationDate.getTime());

    return (
        <Box style={{
            display: "flex",
            alignItems: "center",
            gap: "4px"
        }}>
            {icon}
            <Typography variant="body2" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {label}
                {isValidDate ? <LocalizedDate date={publicationDate} /> : value}
            </Typography>
        </Box>
    );
};
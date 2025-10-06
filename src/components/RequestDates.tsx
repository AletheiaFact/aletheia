import React from "react";
import { Box, Typography } from "@mui/material";

interface RequestDatesProps {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

export const RequestDates: React.FC<RequestDatesProps> = ({ icon, label, value }) => {
    return (
        <Box style={{
            display: "flex",
            alignItems: "center",
            gap: "4px"
        }}>
            {icon}
            <Typography variant="body2" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {label}
                {value}
            </Typography>
        </Box>
    );
};
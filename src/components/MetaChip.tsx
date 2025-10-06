import React from "react";
import { Box, Typography, Chip } from "@mui/material"

interface MetaChipProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: "primary" | "secondary" | "success" | "error"
}

export const MetaChip: React.FC<MetaChipProps> = ({ icon, label, value, color = "primary" }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    mt: 0.4,
                }}
            >
                {icon}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                }}
            >
                <Typography
                    variant="body2"
                >
                    {label}
                </Typography>

                <Chip
                    label={value}
                    color={color}
                    size="small"
                />
            </Box>
        </Box>
    );
};
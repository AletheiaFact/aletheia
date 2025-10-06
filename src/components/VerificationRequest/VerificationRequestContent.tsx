import React from "react";
import { Box, Typography } from "@mui/material";

interface ContentVRProps {
    label: string;
    value: React.ReactNode;
}

export const ContentVR: React.FC<ContentVRProps> = ({ label, value }) => {
    return (
        <Box style={{
            display: "flex",
            alignItems: "center",
        }}>
            <Box>
                <Typography variant="body2">
                    <strong>{label}</strong>
                </Typography>
                <Typography variant="body2">{value}</Typography>
            </Box>
        </Box>
    );
};
import React from "react";
import { Box, Typography } from "@mui/material";

interface VerificationRequestContentProps {
    label: string;
    value: React.ReactNode;
    dataCy?: string;
}

export const VerificationRequestContent: React.FC<VerificationRequestContentProps> = ({ label, value, dataCy }) => {
    return (
        <Box style={{
            display: "flex",
            alignItems: "center",
        }}>
            <Box data-cy={dataCy}>
                <Typography variant="body2">
                    <strong>{label}</strong>
                </Typography>
                <Typography variant="body2">{value}</Typography>
            </Box>
        </Box>
    );
};

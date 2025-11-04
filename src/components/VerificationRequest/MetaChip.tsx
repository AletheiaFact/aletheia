import React from "react";
import { Box, Typography, Chip } from "@mui/material"
import { useTranslation } from "next-i18next";
interface MetaChipProps {
    icon: React.ReactNode;
    label: string;
    label_value: string;
    style: React.CSSProperties;
}

export const MetaChip: React.FC<MetaChipProps> = ({ icon, label, label_value, style }) => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: "4px",
                }}
            >
                <Box color="text.secondary">
                    {icon}
                </Box>
                <Typography
                    variant="body2"
                >
                    {label}
                </Typography>
            </Box>
            <Chip
                label={label_value || t("claimForm:undefined")}
                style={style}
                size="small"
            />
        </Box>
    );
};
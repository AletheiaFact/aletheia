import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";

interface FilterPanelHeaderProps {
    onClear: () => void;
    // Phone sheet only
    onClose?: () => void;
}

const FilterPanelHeader = ({ onClear, onClose }: FilterPanelHeaderProps) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Typography variant="h2" sx={{ fontSize: 20 }}>
                {t("repository:filters")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                    size="small"
                    onClick={onClear}
                    sx={{ textTransform: "none", color: colors.lightPrimary }}
                    data-cy="testRepositoryClearFilters"
                >
                    {t("repository:clearFilters")}
                </Button>
                {onClose && (
                    <IconButton
                        size="small"
                        onClick={onClose}
                        aria-label={t("repository:closeFilters")}
                        data-cy="testRepositoryCloseFilters"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default FilterPanelHeader;

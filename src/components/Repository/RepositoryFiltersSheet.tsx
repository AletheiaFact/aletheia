import React from "react";
import { Box, Drawer } from "@mui/material";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../AletheiaButton";

interface RepositoryFiltersSheetProps {
    open: boolean;
    onClose: () => void;
    // While the results are reloading the count is not known yet
    refreshing: boolean;
    total: number;
    children: React.ReactNode;
}

// Phone only: the filters panel in a bottom sheet
const RepositoryFiltersSheet = ({
    open,
    onClose,
    refreshing,
    total,
    children,
}: RepositoryFiltersSheetProps) => {
    const { t } = useTranslation();

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            // MUI 5 Drawer only styles its paper through PaperProps
            PaperProps={{
                sx: {
                    maxHeight: "90vh",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Grab handle of the bottom sheet */}
            <Box
                sx={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.neutralTertiary,
                    mx: "auto",
                    mt: 1,
                    flexShrink: 0,
                }}
            />
            <Box sx={{ overflowY: "auto", px: 2.5, pt: 1.5, pb: 2 }}>
                {children}
            </Box>
            <Box
                sx={{
                    px: 2.5,
                    pt: 1.5,
                    pb: "calc(16px + env(safe-area-inset-bottom, 0px))",
                    borderTop: `1px solid ${colors.neutralTertiary}`,
                    flexShrink: 0,
                }}
            >
                <AletheiaButton
                    type={ButtonType.primary}
                    onClick={onClose}
                    loading={refreshing}
                    data-cy="testRepositoryApplyFilters"
                    style={{ width: "100%" }}
                >
                    {refreshing
                        ? t("repository:applyFilters")
                        : t("repository:showResults", { count: total })}
                </AletheiaButton>
            </Box>
        </Drawer>
    );
};

export default RepositoryFiltersSheet;

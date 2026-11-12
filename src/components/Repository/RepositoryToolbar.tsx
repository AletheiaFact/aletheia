import React from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import SortSelect from "./filters/SortSelect";
import { RepositoryTab, SortOrder } from "./repositoryFilters";

interface RepositoryToolbarProps {
    tab: RepositoryTab;
    isMobile: boolean;
    // Hidden while the results reload
    total: number | null;
    searchText: string;
    onSearchChange: (text: string) => void;
    order: SortOrder;
    onOrderChange: (order: SortOrder) => void;
    activeFilterCount: number;
    onOpenFilters: () => void;
}

// Title and total, search, sort and, on a phone, the filters button
const RepositoryToolbar = ({
    tab,
    isMobile,
    total,
    searchText,
    onSearchChange,
    order,
    onOrderChange,
    activeFilterCount,
    onOpenFilters,
}: RepositoryToolbarProps) => {
    const { t } = useTranslation();
    const isClaims = tab === "claims";
    const searchLabel = t(
        isClaims ? "repository:searchClaims" : "repository:searchReviews"
    );

    const title = (
        <Box sx={{ flexShrink: 0 }}>
            <Typography variant="h2" fontSize={22}>
                {t(isClaims ? "repository:claimsTab" : "repository:reviewsTab")}
            </Typography>
            <Typography
                variant="body2"
                sx={{ color: colors.neutralSecondary, minHeight: 20 }}
                data-cy="testRepositoryTotal"
            >
                {total !== null &&
                    t(
                        isClaims
                            ? "repository:claimsTotal"
                            : "repository:reviewsTotal",
                        { count: total }
                    )}
            </Typography>
        </Box>
    );

    const search = (
        <TextField
            size="small"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchLabel}
            inputProps={{ maxLength: 100, "aria-label": searchLabel }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
                ),
            }}
            sx={{ flex: "1 1 auto", minWidth: 0, backgroundColor: colors.white }}
            data-cy="testRepositorySearch"
        />
    );

    if (isMobile) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {title}
                <Box sx={{ display: "flex" }}>{search}</Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={onOpenFilters}
                        data-cy="testRepositoryOpenFilters"
                        sx={{
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            height: 40,
                            color: colors.primary,
                            borderColor: colors.neutralTertiary,
                        }}
                    >
                        {t("repository:showFilters")}
                        {activeFilterCount > 0 && (
                            <Box
                                component="span"
                                sx={{ ml: 1, color: colors.neutralSecondary }}
                                data-cy="testRepositoryActiveFilterCount"
                            >
                                {activeFilterCount}
                            </Box>
                        )}
                    </Button>
                    <SortSelect
                        value={order}
                        onChange={onOrderChange}
                        sx={{ minWidth: 0, flex: "0 1 180px" }}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                // Below lg the title sits above the search
                flexDirection: { xs: "column", lg: "row" },
                alignItems: { xs: "stretch", lg: "flex-start" },
                gap: { xs: 1.5, lg: 3 },
            }}
        >
            {title}
            <Box sx={{ display: "flex", flex: 1, gap: 1.5 }}>
                {search}
                <SortSelect
                    value={order}
                    onChange={onOrderChange}
                    sx={{ minWidth: 180 }}
                />
            </Box>
        </Box>
    );
};

export default RepositoryToolbar;

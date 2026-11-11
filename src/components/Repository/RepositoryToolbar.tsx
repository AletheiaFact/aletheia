import React from "react";
import {
    Badge,
    Box,
    Button,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import SortSelect from "./filters/SortSelect";
import { RepositoryTab, SortOrder } from "./repositoryFilters";

interface RepositoryToolbarProps {
    tab: RepositoryTab;
    isMobile: boolean;
    searchText: string;
    onSearchChange: (text: string) => void;
    order: SortOrder;
    onOrderChange: (order: SortOrder) => void;
    hasActiveFilters: boolean;
    onOpenFilters: () => void;
}

// Search, plus the sort on desktop or the filters button on a phone
const RepositoryToolbar = ({
    tab,
    isMobile,
    searchText,
    onSearchChange,
    order,
    onOrderChange,
    hasActiveFilters,
    onOpenFilters,
}: RepositoryToolbarProps) => {
    const { t } = useTranslation();
    const searchLabel = t(
        tab === "claims" ? "repository:searchClaims" : "repository:searchReviews"
    );

    return (
        <Box
            sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                // Search and the filters button share one row
                flexWrap: isMobile ? "nowrap" : "wrap",
            }}
        >
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
                sx={{
                    flex: isMobile ? "1 1 0" : "1 1 280px",
                    minWidth: 0,
                    backgroundColor: colors.white,
                }}
                data-cy="testRepositorySearch"
            />
            {isMobile ? (
                <Badge
                    color="primary"
                    variant="dot"
                    invisible={!hasActiveFilters}
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
                        }}
                    >
                        {t("repository:showFilters")}
                    </Button>
                </Badge>
            ) : (
                // On a phone the sort lives in the filters sheet
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SortIcon fontSize="small" />
                    <Typography
                        component="label"
                        htmlFor="repository-sort"
                        sx={{ fontWeight: 600 }}
                    >
                        {t("repository:sort")}
                    </Typography>
                    <SortSelect
                        id="repository-sort"
                        value={order}
                        onChange={onOrderChange}
                        sx={{ minWidth: 170 }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default RepositoryToolbar;

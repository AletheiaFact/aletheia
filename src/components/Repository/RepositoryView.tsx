import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";
import RepositoryFilterPanel from "./RepositoryFilterPanel";
import RepositoryFiltersSheet from "./RepositoryFiltersSheet";
import RepositoryResults from "./RepositoryResults";
import RepositoryTabs from "./RepositoryTabs";
import RepositoryToolbar from "./RepositoryToolbar";
import useRepositoryFilters from "./useRepositoryFilters";
import useRepositoryList from "./useRepositoryList";
import { RepositoryQuery, hasActiveFilters } from "./repositoryFilters";

interface RepositoryViewProps {
    initialQuery: RepositoryQuery;
    // Lets the page hide floating buttons behind the phone filters sheet
    onFiltersOpenChange?: (open: boolean) => void;
}

const RepositoryView = ({
    initialQuery,
    onFiltersOpenChange,
}: RepositoryViewProps) => {
    const { t } = useTranslation();
    // Below the app's md breakpoint the filters move into a bottom sheet
    const isMobile = !!useAppSelector((state) => state?.vw?.md);
    const {
        tab,
        changeTab,
        filters,
        updateFilters,
        clearFilters,
        searchText,
        setSearchText,
    } = useRepositoryFilters(initialQuery);
    const list = useRepositoryList(tab, filters);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isClaims = tab === "claims";
    const filtersActive = hasActiveFilters(filters);

    const closeDrawer = () => setDrawerOpen(false);
    const sheetOpen = isMobile && drawerOpen;

    useEffect(() => {
        onFiltersOpenChange?.(sheetOpen);
    }, [sheetOpen, onFiltersOpenChange]);

    const renderFilterPanel = (inSheet = false) => (
        <RepositoryFilterPanel
            tab={tab}
            filters={filters}
            contentModelCounts={list.contentModelCounts}
            onChange={updateFilters}
            onClear={clearFilters}
            showSort={inSheet}
            onClose={inSheet ? closeDrawer : undefined}
        />
    );

    return (
        <Grid container sx={{ mt: 8, mb: 6, justifyContent: "center" }}>
            <Grid item xs={11} lg={10.5}>
                <Typography variant="h1" fontSize={32}>
                    {t("claim:claimListTitle")}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {t("claim:claimListDescription")}
                </Typography>

                <RepositoryTabs value={tab} onChange={changeTab} />

                <Grid container spacing={3} sx={{ mt: 0 }}>
                    {!isMobile && (
                        <Grid item md={3}>
                            <Paper
                                elevation={2}
                                sx={{ p: 2.5, position: "sticky", top: 80 }}
                            >
                                {renderFilterPanel()}
                            </Paper>
                        </Grid>
                    )}

                    <Grid item xs={12} md={isMobile ? 12 : 9}>
                        <RepositoryToolbar
                            tab={tab}
                            isMobile={isMobile}
                            searchText={searchText}
                            onSearchChange={setSearchText}
                            order={filters.order}
                            onOrderChange={(order) => updateFilters({ order })}
                            hasActiveFilters={filtersActive}
                            onOpenFilters={() => setDrawerOpen(true)}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 1.5,
                                my: 2,
                            }}
                        >
                            {!isMobile && (
                                <Typography variant="h2" fontSize={22}>
                                    {t(
                                        isClaims
                                            ? "repository:claimsTab"
                                            : "repository:reviewsTab"
                                    )}
                                </Typography>
                            )}
                            {!list.refreshing && (
                                <Typography
                                    variant="body2"
                                    data-cy="testRepositoryTotal"
                                >
                                    {t(
                                        isClaims
                                            ? "repository:claimsTotal"
                                            : "repository:reviewsTotal",
                                        { count: list.total }
                                    )}
                                </Typography>
                            )}
                        </Box>

                        <RepositoryResults
                            tab={tab}
                            list={list}
                            hasActiveFilters={filtersActive}
                            onClearFilters={clearFilters}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <RepositoryFiltersSheet
                open={sheetOpen}
                onClose={closeDrawer}
                refreshing={list.refreshing}
                total={list.total}
            >
                {renderFilterPanel(true)}
            </RepositoryFiltersSheet>
        </Grid>
    );
};

export default RepositoryView;

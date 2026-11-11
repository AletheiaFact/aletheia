import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";
import ActiveFilterChips, { getActiveFilters } from "./ActiveFilterChips";
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
    const { t, i18n } = useTranslation();
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
    const activeFilters = getActiveFilters(tab, filters, i18n.language, t);

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
            countsReady={!list.refreshing}
            onChange={updateFilters}
            onClear={clearFilters}
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
                            total={list.refreshing ? null : list.total}
                            searchText={searchText}
                            onSearchChange={setSearchText}
                            order={filters.order}
                            onOrderChange={(order) => updateFilters({ order })}
                            activeFilterCount={activeFilters.length}
                            onOpenFilters={() => setDrawerOpen(true)}
                        />

                        <Divider sx={{ my: 2.5 }} />

                        {activeFilters.length > 0 && (
                            <Box sx={{ mb: 2.5 }}>
                                <ActiveFilterChips
                                    filters={activeFilters}
                                    onChange={updateFilters}
                                    onClear={clearFilters}
                                />
                            </Box>
                        )}

                        <RepositoryResults
                            tab={tab}
                            list={list}
                            hasActiveFilters={hasActiveFilters(filters)}
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

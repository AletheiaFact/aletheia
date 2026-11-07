import React, { useEffect, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Drawer,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import ClaimCard from "../Claim/ClaimCard";
import ReviewCard from "../ClaimReview/ReviewCard";
import RepositoryFilterPanel from "./RepositoryFilterPanel";
import useRepositoryList from "./useRepositoryList";
import {
    EMPTY_FILTERS,
    RepositoryFilters,
    RepositoryQuery,
    RepositoryTab,
    hasActiveFilters,
    parseFilters,
    parseTab,
    toSearchParams,
} from "./repositoryFilters";

const SEARCH_DEBOUNCE_MS = 400;

const RepositoryView = ({ initialQuery }: { initialQuery: RepositoryQuery }) => {
    const { t } = useTranslation();
    // Below the app's md breakpoint the filters move into a drawer
    const isMobile = useAppSelector((state) => state?.vw?.md);
    const [tab, setTab] = useState<RepositoryTab>(() => parseTab(initialQuery));
    // Each tab keeps its own filters; the URL reflects the open tab.
    const [filtersByTab, setFiltersByTab] = useState<
        Record<RepositoryTab, RepositoryFilters>
    >(() => {
        const initialTab = parseTab(initialQuery);
        const initialFilters = parseFilters(initialQuery);
        return {
            claims: initialTab === "claims" ? initialFilters : EMPTY_FILTERS,
            reviews: initialTab === "reviews" ? initialFilters : EMPTY_FILTERS,
        };
    });
    const filters = filtersByTab[tab];
    const [searchText, setSearchText] = useState(filters.q);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const list = useRepositoryList(tab, filters);
    const isClaims = tab === "claims";

    const updateFilters = (changes: Partial<RepositoryFilters>) =>
        setFiltersByTab((previous) => ({
            ...previous,
            [tab]: { ...previous[tab], ...changes },
        }));

    const clearFilters = () => {
        setSearchText("");
        updateFilters({ ...EMPTY_FILTERS, order: filters.order });
    };

    const changeTab = (nextTab: RepositoryTab) => {
        setTab(nextTab);
        setSearchText(filtersByTab[nextTab].q);
    };

    useEffect(() => {
        if (searchText === filters.q) return;
        const timer = setTimeout(
            () =>
                setFiltersByTab((previous) => ({
                    ...previous,
                    [tab]: { ...previous[tab], q: searchText },
                })),
            SEARCH_DEBOUNCE_MS
        );
        return () => clearTimeout(timer);
    }, [searchText, tab, filters.q]);

    useEffect(() => {
        const params = toSearchParams(tab, filters).toString();
        const search = params ? "?" + params : "";
        const url = window.location.pathname + search;
        // Replace without a Next navigation: the page is rendered by Nest,
        // so the Next router does not know the /claim route.
        window.history.replaceState(window.history.state, "", url);
    }, [tab, filters]);

    const filterPanel = (
        <RepositoryFilterPanel
            tab={tab}
            filters={filters}
            contentModelCounts={list.contentModelCounts}
            onChange={updateFilters}
            onClear={clearFilters}
        />
    );

    const renderResults = () => {
        if (list.refreshing) {
            return (
                <Grid container spacing={2}>
                    {[0, 1, 2, 3].map((key) => (
                        <Grid item xs={12} md={isClaims ? 6 : 4} key={key}>
                            <Skeleton variant="rounded" height={240} />
                        </Grid>
                    ))}
                </Grid>
            );
        }

        if (!list.items.length) {
            return (
                <Paper
                    variant="outlined"
                    sx={{ p: 4, textAlign: "center" }}
                    data-cy="testRepositoryEmpty"
                >
                    <Typography>
                        {t(
                            list.error
                                ? "repository:loadError"
                                : "repository:noResults"
                        )}
                    </Typography>
                    {hasActiveFilters(filters) && (
                        <Button
                            onClick={clearFilters}
                            data-cy="testRepositoryEmptyClear"
                            sx={{ mt: 2, textTransform: "none" }}
                        >
                            {t("repository:clearFilters")}
                        </Button>
                    )}
                </Paper>
            );
        }

        return (
            <>
                <Grid container spacing={2} data-cy="testRepositoryResults">
                    {list.items.map((item) =>
                        isClaims ? (
                            <Grid item xs={12} md={6} key={item._id}>
                                <ClaimCard
                                    personality={{ _id: null }}
                                    claim={item}
                                />
                            </Grid>
                        ) : (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                lg={4}
                                key={item.content?._id || item.reviewHref}
                            >
                                <ReviewCard review={item} />
                            </Grid>
                        )
                    )}
                </Grid>
                {list.hasMore && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <AletheiaButton
                            type={ButtonType.whiteOutline}
                            onClick={list.loadMore}
                            loading={list.loading}
                            data-cy="testRepositoryLoadMore"
                        >
                            {t("repository:loadMore")}
                        </AletheiaButton>
                    </Box>
                )}
            </>
        );
    };

    return (
        <Grid container sx={{ mt: 8, mb: 6, justifyContent: "center" }}>
            <Grid item xs={11} lg={10.5}>
                <Typography variant="h1" fontSize={32}>
                    {t("claim:claimListTitle")}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {t("claim:claimListDescription")}
                </Typography>

                <Tabs
                    value={tab}
                    onChange={(_event, value) => changeTab(value)}
                    sx={{
                        mt: 3,
                        borderBottom: `1px solid ${colors.neutralTertiary}`,
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontSize: 16,
                            minHeight: 48,
                        },
                        "& .Mui-selected": { color: `${colors.primary} !important` },
                        "& .MuiTabs-indicator": { backgroundColor: colors.primary },
                    }}
                >
                    <Tab
                        value="claims"
                        icon={<ChatOutlinedIcon fontSize="small" />}
                        iconPosition="start"
                        label={t("repository:claimsTab")}
                        data-cy="testRepositoryClaimsTab"
                    />
                    <Tab
                        value="reviews"
                        icon={<VerifiedUserIcon fontSize="small" />}
                        iconPosition="start"
                        label={t("repository:reviewsTab")}
                        data-cy="testRepositoryReviewsTab"
                    />
                </Tabs>

                <Grid container spacing={3} sx={{ mt: 0 }}>
                    {!isMobile && (
                        <Grid item md={3}>
                            <Paper
                                elevation={2}
                                sx={{ p: 2.5, position: "sticky", top: 80 }}
                            >
                                {filterPanel}
                            </Paper>
                        </Grid>
                    )}

                    <Grid item xs={12} md={isMobile ? 12 : 9}>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1.5,
                                alignItems: "center",
                            }}
                        >
                            <TextField
                                size="small"
                                value={searchText}
                                onChange={(event) =>
                                    setSearchText(event.target.value)
                                }
                                placeholder={t(
                                    isClaims
                                        ? "repository:searchClaims"
                                        : "repository:searchReviews"
                                )}
                                inputProps={{
                                    maxLength: 100,
                                    "aria-label": t(
                                        isClaims
                                            ? "repository:searchClaims"
                                            : "repository:searchReviews"
                                    ),
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    flex: "1 1 280px",
                                    backgroundColor: colors.white,
                                }}
                                data-cy="testRepositorySearch"
                            />
                            {isMobile && (
                                <Badge
                                    color="primary"
                                    variant="dot"
                                    invisible={!hasActiveFilters(filters)}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterListIcon />}
                                        onClick={() => setDrawerOpen(true)}
                                        data-cy="testRepositoryOpenFilters"
                                        sx={{ textTransform: "none" }}
                                    >
                                        {t("repository:showFilters")}
                                    </Button>
                                </Badge>
                            )}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <SortIcon fontSize="small" />
                                <Typography
                                    component="label"
                                    htmlFor="repository-sort"
                                    sx={{ fontWeight: 600 }}
                                >
                                    {t("repository:sort")}
                                </Typography>
                                <Select
                                    size="small"
                                    id="repository-sort"
                                    value={filters.order}
                                    onChange={(event) =>
                                        updateFilters({
                                            order: event.target.value as
                                                | "asc"
                                                | "desc",
                                        })
                                    }
                                    sx={{
                                        minWidth: 170,
                                        backgroundColor: colors.white,
                                    }}
                                    data-cy="testRepositorySort"
                                >
                                    <MenuItem value="desc">
                                        {t("repository:sortNewest")}
                                    </MenuItem>
                                    <MenuItem value="asc">
                                        {t("repository:sortOldest")}
                                    </MenuItem>
                                </Select>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 1.5,
                                my: 2,
                            }}
                        >
                            <Typography variant="h2" fontSize={22}>
                                {t(
                                    isClaims
                                        ? "repository:claimsTab"
                                        : "repository:reviewsTab"
                                )}
                            </Typography>
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

                        {renderResults()}
                    </Grid>
                </Grid>
            </Grid>

            <Drawer
                anchor="left"
                open={isMobile && drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: "min(320px, 90vw)", p: 2.5 } }}
            >
                {filterPanel}
                <AletheiaButton
                    type={ButtonType.primary}
                    onClick={() => setDrawerOpen(false)}
                    data-cy="testRepositoryApplyFilters"
                    style={{ marginTop: 24, width: "100%" }}
                >
                    {t("repository:applyFilters")}
                </AletheiaButton>
            </Drawer>
        </Grid>
    );
};

export default RepositoryView;

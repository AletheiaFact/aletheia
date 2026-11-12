import React from "react";
import { Box, Button, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import ClaimCard from "../Claim/ClaimCard";
import ReviewCard from "../ClaimReview/ReviewCard";
import { RepositoryTab } from "./repositoryFilters";
import { RepositoryList } from "./useRepositoryList";

interface RepositoryResultsProps {
    tab: RepositoryTab;
    list: RepositoryList;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

const LoadingResults = () => (
    <Grid container spacing={2}>
        {[0, 1, 2, 3].map((key) => (
            <Grid item xs={12} lg={6} key={key}>
                <Skeleton variant="rounded" height={240} />
            </Grid>
        ))}
    </Grid>
);

const RepositoryResults = ({
    tab,
    list,
    hasActiveFilters,
    onClearFilters,
}: RepositoryResultsProps) => {
    const { t } = useTranslation();
    const isClaims = tab === "claims";

    if (list.refreshing) {
        return <LoadingResults />;
    }

    if (!list.items.length) {
        return (
            <Paper
                variant="outlined"
                sx={{ p: 4, textAlign: "center" }}
                data-cy="testRepositoryEmpty"
            >
                <Typography>
                    {t(list.error ? "repository:loadError" : "repository:noResults")}
                </Typography>
                {hasActiveFilters && (
                    <Button
                        onClick={onClearFilters}
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
                {list.items.map((item) => (
                    <Grid
                        item
                        xs={12}
                        lg={6}
                        key={
                            isClaims
                                ? item._id
                                : item.content?._id || item.reviewHref
                        }
                    >
                        {isClaims ? (
                            <ClaimCard personality={{ _id: null }} claim={item} />
                        ) : (
                            <ReviewCard review={item} />
                        )}
                    </Grid>
                ))}
            </Grid>
            {list.hasMore && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        mt: 4,
                    }}
                >
                    <AletheiaButton
                        type={ButtonType.whiteOutline}
                        onClick={list.loadMore}
                        loading={list.loading}
                        data-cy="testRepositoryLoadMore"
                    >
                        {t("repository:loadMore")}
                    </AletheiaButton>
                    <Typography
                        variant="body2"
                        sx={{ color: colors.neutralSecondary }}
                        data-cy="testRepositoryShownOfTotal"
                    >
                        {t("repository:shownOfTotal", {
                            shown: list.items.length,
                            total: list.total,
                        })}
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default RepositoryResults;

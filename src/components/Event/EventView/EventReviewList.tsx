import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { Topic } from "../../../types/Topic";
import { NameSpaceEnum } from "../../../types/Namespace";
import claimReviewApi from "../../../api/claimReviewApi";
import Loading from "../../Loading";
import ErrorState from "../../ErrorState";
import EventLoadMore from "../EventList/EventLoadMore";
import ReviewsGrid from "../../ClaimReview/ReviewsGrid";
import EventTitle from "../EventList/EventTitle";
import { EventsActions, EventsState } from "../../../types/event";

type EventReviewsProps = {
    mainTopic: Topic;
    filterTopics?: Topic[];
    nameSpace: NameSpaceEnum;
    state: EventsState;
    actions: EventsActions;
};

const EventReviewsList = ({
    mainTopic,
    filterTopics, // TODO: create a sub-filter based on these values
    nameSpace,
    state,
    actions
}: EventReviewsProps) => {
    const { reviewQuery, isLoading, error, reviewData, viewMode } = state
    const { setIsLoading, setError, setReviewData, t, setReviewQuery, setViewMode } = actions

    const handleFetch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await claimReviewApi.get({
                ...reviewQuery,
                isHidden: false,
                nameSpace: nameSpace,
                mainTopicWikidataID: mainTopic.wikidataId,
            });

            if (reviewQuery.page === 1) {
                setReviewData({
                    items: response.data,
                    total: response.total || 0,
                });
            } else {
                setReviewData((prev) => ({
                    items: [...prev.items, ...response.data],
                    total: response.total || prev.total,
                }));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (mainTopic?.wikidataId) {
            handleFetch();
        }
    }, [reviewQuery, nameSpace, mainTopic?.wikidataId]);

    if (isLoading && reviewQuery.page === 1) {
        return <Loading />;
    }

    if (error) {
        return <ErrorState message={t("events:fetchError") || error} />;
    }

    return (
        <Grid container className="eventContainerBase">
            <Grid item xs={11} sm={11} md={8} className="eventSection">
                <Typography variant="h2" fontSize={24}>
                    {t("events:latestReviews")}
                </Typography>
                <ReviewsGrid
                    reviews={reviewData.items}
                    title={
                        <EventTitle
                            total={reviewData.total}
                            hasToggle={true}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            t={t}
                        />
                    }
                />
            </Grid>
            <EventLoadMore
                visible={reviewData.total > reviewData.items.length}
                onLoadMore={() =>
                    setReviewQuery((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                label={t("events:loadMoreButton")}
            />
        </Grid>
    );
};

export default EventReviewsList;

import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { Topic } from "../../../types/Topic";
import { NameSpaceEnum } from "../../../types/Namespace";
import Loading from "../../Loading";
import ErrorState from "../../ErrorState";
import EventLoadMore from "../EventList/EventLoadMore";
import EventTitle from "../EventList/EventTitle";
import verificationRequestApi from "../../../api/verificationRequestApi";
import VerificationRequestGridList from "../../VerificationRequest/VerificationRequestGridList";
import { VerificationRequestStatus } from "../../../types/enums";
import { EventsActions, EventsState } from "../../../types/event";

type EventVerificationRequestListProps = {
    mainTopic: Topic;
    filterTopics?: Topic[];
    nameSpace: NameSpaceEnum;
    state: EventsState;
    actions: EventsActions;
};

const EventVerificationRequestList = ({
    mainTopic,
    filterTopics, // TODO: create a sub-filter based on these values
    nameSpace,
    state,
    actions
}: EventVerificationRequestListProps) => {
    const { verificationRequestData, isLoading, error, verificationRequestQuery, viewMode } = state
    const { setIsLoading, setError, setVerificationRequestQuery, t, setVerificationRequestData, setViewMode } = actions

    const handleFetch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await verificationRequestApi.get({
                ...verificationRequestQuery,
                status: [
                    VerificationRequestStatus.PRE_TRIAGE,
                    VerificationRequestStatus.IN_TRIAGE,
                    VerificationRequestStatus.POSTED
                ],
                topics: [mainTopic.name],
            });

            if (response && "data" in response) {
                if (verificationRequestQuery.page === 1) {
                    setVerificationRequestData({
                        items: response.data,
                        total: response.total || 0,
                        totalPages: response.totalPages || 0
                    });
                } else {
                    setVerificationRequestData((prev) => ({
                        items: [...prev.items, ...response.data],
                        total: response.total || prev.total,
                        totalPages: response.totalPages || 0
                    }));
                }
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
    }, [verificationRequestQuery, nameSpace, mainTopic?.wikidataId]);

    if (isLoading && verificationRequestQuery.page === 1) {
        return <Loading />;
    }

    if (error) {
        return <ErrorState message={t("events:fetchError") || error} />;
    }

    return (
        <Grid container className="eventContainerBase">
            <Grid item xs={11} sm={11} md={8} className="eventSection">
                <Typography variant="h2" fontSize={24}>
                    {t("events:latestRelatedDenuncias")}
                </Typography>
                <VerificationRequestGridList
                    verificationRequest={verificationRequestData.items}
                    title={
                        <EventTitle
                            total={verificationRequestData.total}
                            hasToggle={true}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            t={t}
                        />
                    }
                />
            </Grid>
            <EventLoadMore
                visible={verificationRequestData.total > verificationRequestData.items.length}
                onLoadMore={() =>
                    setVerificationRequestQuery((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                label={t("events:loadMoreButton")}
            />
        </Grid>
    );
};

export default EventVerificationRequestList;

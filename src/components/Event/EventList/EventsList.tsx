import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import EventApi from "../../../api/eventApi";
import Loading from "../../Loading";
import ErrorState from "../../ErrorState";
import EventFilters from "./EventFilters";
import EventLoadMore from "./EventLoadMore";
import EventsGrid from "./EventGrid";
import EventTitle from "./EventTitle";
import useEventsHook from "../hooks/useEventsHook";

const EventsList = () => {
    const { state, actions } = useEventsHook()
    const { eventsQuery, error, isLoading, eventsData } = state
    const { setIsLoading, setError, setEventsData, t, setEventsQuery } = actions

    const handleFetch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const events = await EventApi.getEvents(eventsQuery);

            if (eventsQuery.page === 1) {
                setEventsData(events);
            } else {
                setEventsData((prev) => ({
                    events: [...prev.events, ...events.events],
                    eventMetrics: {
                        verificationRequests:
                            prev.eventMetrics.verificationRequests +
                            events.eventMetrics.verificationRequests,
                        claims: prev.eventMetrics.claims + events.eventMetrics.claims,
                        reviews: prev.eventMetrics.reviews + events.eventMetrics.reviews,
                    },
                    total: events.total,
                }));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetch();
    }, [eventsQuery]);

    if (isLoading && eventsQuery.page === 1) {
        return <Loading />;
    }

    if (error) {
        return <ErrorState message={t("events:fetchError")} />;
    }

    return (
        <main>
            <Grid container justifyContent="center" marginBottom={4}>
                <EventFilters
                    selectedStatus={eventsQuery.status}
                    onStatusChange={(status) =>
                        setEventsQuery((prev) => ({ ...prev, status, page: 1 }))
                    }
                    t={t}
                />

                <Grid item xs={11} sm={8}>
                    <EventsGrid
                        title={
                            <EventTitle
                                total={eventsData.total}
                                t={t}
                            />
                        }
                        events={eventsData.events}
                        eventMetrics={eventsData.eventMetrics}
                        disableSeeMoreButton={true}
                        t={t}
                        hasDivider={true}
                    />
                </Grid>

                <EventLoadMore
                    visible={eventsData.total > eventsData.events.length}
                    onLoadMore={() =>
                        setEventsQuery((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    label={t("events:loadMoreButton")}
                />
            </Grid>
        </main>
    );
};

export default EventsList;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import GridList from "../../GridList";
import EventApi from "../../../api/eventApi";
import Loading from "../../Loading";
import { EventPayload, ListEventsOptions } from "../../../types/event";
import EventCard from "./EventCard";
import ErrorState from "../../ErrorState";
import EventFilters from "./EventFilters";
import EventLoadMore from "./EventLoadMore";
import EventTitle from "./EventTitle";

interface IData {
    events: EventPayload[],
    total: number
}

const EventsList = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<IData>({ events: [], total: 0 });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<ListEventsOptions>({
        page: 1,
        pageSize: 10,
        order: "asc",
        status: "all",
    })

    const handleFetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const events = await EventApi.getEvents(query);

            if (query.page === 1) {
                setData(events)
            } else {
                setData(prev => ({
                    events: [...prev.events, ...events.events],
                    total: events.total
                }))
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetch();
    }, [query]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorState message={t("events:fetchError")} />
    }

    return (
        <main>
            <Grid container justifyContent="center" marginBottom={4}>
                <EventFilters
                    selectedStatus={query.status}
                    onStatusChange={(status) => setQuery(prev => ({ ...prev, status, page: 1 }))}
                    t={t}
                />
                <Grid xs={8}>
                    <GridList
                        title={
                            <EventTitle
                                total={data.total}
                                t={t}
                            />
                        }
                        dataSource={data.events}
                        loggedInMaxColumns={6}
                        disableSeeMoreButton={true}
                        hasDivider={true}
                        renderItem={(event) =>
                            <EventCard
                                event={event}
                                openEventLabel={t("events:openEvent")}
                            />
                        }
                    />
                </Grid>
                <EventLoadMore
                    visible={data.total > data.events.length}
                    onLoadMore={() => setQuery(prev => ({ ...prev, page: prev.page + 1 }))}
                    label={t("events:loadMoreButton")}
                />

            </Grid>
        </main >
    )
}

export default EventsList

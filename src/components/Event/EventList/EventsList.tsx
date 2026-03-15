import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import EventApi from "../../../api/eventApi";
import Loading from "../../Loading";
import {
  EventMetrics,
  EventPayload,
  ListEventsOptions,
} from "../../../types/event";
import ErrorState from "../../ErrorState";
import EventFilters from "./EventFilters";
import EventLoadMore from "./EventLoadMore";
import EventsGrid from "./EventGrid";
import EventTitle from "./EventTitle";

interface IData {
  events: EventPayload[];
  eventMetrics: EventMetrics;
  total: number;
}

const EventsList = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<IData>({
      events: [],
      eventMetrics: { verificationRequests: 0, claims: 0, reviews: 0 },
      total: 0,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<ListEventsOptions>({
        page: 1,
        pageSize: 10,
        order: "asc",
        status: "all",
  });

    const handleFetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const events = await EventApi.getEvents(query);

        if (query.page === 1) {
            setData(events);
      } else {
          setData((prev) => ({
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
        setLoading(false);
    }
  };

    useEffect(() => {
        handleFetch();
    }, [query]);

    if (loading && query.page === 1) {
        return <Loading />;
    }

    if (error) {
        return <ErrorState message={t("events:fetchError")} />;
  }

    return (
      <main>
        <Grid container justifyContent="center" marginBottom={4}>
          <EventFilters
            selectedStatus={query.status}
            onStatusChange={(status) =>
              setQuery((prev) => ({ ...prev, status, page: 1 }))
            }
            t={t}
          />

          <Grid item xs={11} sm={8}>
            <EventsGrid
              title={
                <EventTitle
                  total={data.total}
                  label={t("events:eventsList")}
                  t={t}
                />
              }
              events={data.events}
              eventMetrics={data.eventMetrics}
              t={t}
              hasDivider={true}
            />
          </Grid>

          <EventLoadMore
            visible={data.total > data.events.length}
            onLoadMore={() =>
              setQuery((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            label={t("events:loadMoreButton")}
          />
        </Grid>
      </main>
    );
};

export default EventsList;

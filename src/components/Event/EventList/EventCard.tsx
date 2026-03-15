import React from "react";
import { Grid } from "@mui/material";
import CardBase from "../../CardBase";
import { i18n } from "next-i18next";
import { EventMetrics, EventPayload } from "../../../types/event";
import EventCardHeader from "./EventCardHeader";
import EventCardTitle from "./EventCardTitle";
import EventCardDateRange from "./EventCardDateRange";
import EventCardAction from "./EventCardAction";
import EventMetricsChip from "./EventMetricsChip";

interface EventCardProps {
  event: EventPayload;
  eventMetrics: EventMetrics;
  openEventLabel: string;
}

const EventCard = ({ event, eventMetrics, openEventLabel }: EventCardProps) => {
  const currentLocale = i18n.language || "pt";
  return (
    <CardBase>
      <Grid container padding={3} gap={3} justifyContent="center">
        <EventCardHeader badge={event.badge} location={event.location} />
        <EventCardTitle title={event.name} />
        <EventCardDateRange
          startDate={event.startDate}
          endDate={event.endDate}
          locale={currentLocale}
        />

        <EventMetricsChip eventMetrics={eventMetrics[event.data_hash]} />

        <EventCardAction
          label={openEventLabel}
          href={`/event/${event.data_hash}/${event.slug}`}
        />
      </Grid>
    </CardBase>
  );
};

export default EventCard;

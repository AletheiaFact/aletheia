import React from "react";
import CardBase from "../../CardBase";
import { EventMetricsByHash, EventPayload } from "../../../types/event";
import EventCardHeader from "./EventCardHeader";
import EventCardTitle from "./EventCardTitle";
import EventCardDateRange from "./EventCardDateRange";
import EventCardAction from "./EventCardAction";
import EventMetricsChip from "./EventMetricsChip";
import { EventCardStyled } from "./EventCard.style";

interface EventCardProps {
    event: EventPayload;
    eventMetrics: EventMetricsByHash;
    openEventLabel: string;
    eventHref: string;
}

const EventCard = ({
    event,
    eventMetrics,
    openEventLabel,
    eventHref,
}: EventCardProps) => {
    return (
        <CardBase>
            <EventCardStyled container data-cy="event-card">
                <EventCardHeader
                    badge={event.badge}
                    location={event.location}
                />
                <EventCardTitle title={event.name} />
                <EventCardDateRange
                    startDate={event.startDate}
                    endDate={event.endDate}
                />

                <EventMetricsChip
                    eventMetrics={eventMetrics[event.data_hash]}
                />

                <EventCardAction
                    label={openEventLabel}
                    href={`${eventHref}/${event.data_hash}/${event.slug}`}
                />
            </EventCardStyled>
        </CardBase>
    );
};

export default EventCard;

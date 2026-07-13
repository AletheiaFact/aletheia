import React from "react";
import EventCard from "./EventCard";
import GridList, { SeeMorePosition } from "../../GridList";
import { EventMetrics, EventPayload } from "../../../types/event";
import useEventsHook from "../hooks/useEventsHook";
import { useTranslations } from "next-intl";

type EventsGridProps = {
    events: EventPayload[];
    eventMetrics: EventMetrics;
    hasDivider?: boolean;
    disableSeeMoreButton?: boolean;
    buttonPosition?: SeeMorePosition;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
};

const EventsGrid = ({
    events,
    eventMetrics,
    hasDivider,
    disableSeeMoreButton,
    buttonPosition,
    title,
    subtitle,
}: EventsGridProps) => {
    const { state } = useEventsHook();
    const tEvents = useTranslations("events");

    return (
        <GridList
            title={title}
            subtitle={subtitle}
            dataSource={events}
            itemSize={{ xs: 12, sm: 6 }}
            href={state.eventHref}
            disableSeeMoreButton={disableSeeMoreButton}
            seeMoreButtonLabel={tEvents("seeMoreEventsButton")}
            seeMoreButtonPosition={buttonPosition}
            dataCy="testSeeMoreEvents"
            hasDivider={hasDivider}
            getKey={(event) => event.id}
            renderItem={(event) => (
                <EventCard
                    event={event}
                    eventMetrics={eventMetrics}
                    openEventLabel={tEvents("openEvent")}
                />
            )}
        />
    );
};

export default EventsGrid;

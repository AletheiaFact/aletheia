import React from "react";
import EventCard from "./EventCard";
import GridList, { SeeMorePosition } from "../../GridList";
import { EventMetrics, EventPayload } from "../../../types/event";
import { TFunction } from "react-i18next";
import useEventsHook from "../hooks/useEventsHook";

type EventsGridProps = {
    events: EventPayload[];
    eventMetrics: EventMetrics;
    t: TFunction;
    hasDivider?: boolean;
    disableSeeMoreButton?: boolean;
    buttonPosition?: SeeMorePosition;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
};

const EventsGrid = ({
    events,
    eventMetrics,
    t,
    hasDivider,
    disableSeeMoreButton,
    buttonPosition,
    title,
    subtitle,
}: EventsGridProps) => {
    const { state } = useEventsHook();

    return (
        <GridList
            title={title}
            subtitle={subtitle}
            dataSource={events}
            itemSize={{ xs: 12, sm: 6 }}
            href={state.eventHref}
            disableSeeMoreButton={disableSeeMoreButton}
            seeMoreButtonLabel={t("events:seeMoreEventsButton")}
            seeMoreButtonPosition={buttonPosition}
            dataCy="testSeeMoreEvents"
            hasDivider={hasDivider}
            getKey={(event) => event.id}
            renderItem={(event) => (
                <EventCard
                    event={event}
                    eventMetrics={eventMetrics}
                    openEventLabel={t("events:openEvent")}
                />
            )}
        />
    );
};

export default EventsGrid;

import React from "react";
import EventCard from "./EventCard";
import GridList from "../../GridList";
import { EventMetrics, EventPayload } from "../../../types/event";
import { TFunction } from "react-i18next";
import useEventsHook from "../hooks/useEventsHook";

type EventsGridProps = {
    events: EventPayload[];
    eventMetrics: EventMetrics;
    t: TFunction;
    hasDivider?: boolean;
    disableSeeMoreButton?: boolean;
    title?: React.ReactNode;
};

const EventsGrid = ({
    events,
    eventMetrics,
    t,
    hasDivider,
    disableSeeMoreButton,
    title,
}: EventsGridProps) => {
    const { state } = useEventsHook();

    return (
        <GridList
            title={title}
            dataSource={events}
            loggedInMaxColumns={6}
            href={state.eventHref}
            disableSeeMoreButton={disableSeeMoreButton}
            seeMoreButtonLabel={t("events:seeMoreEventsButton")}
            hasDivider={hasDivider}
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

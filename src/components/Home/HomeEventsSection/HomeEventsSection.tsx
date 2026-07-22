import React from "react";
import { Box } from "@mui/material";
import EventsGrid from "../../Event/EventList/EventGrid";
import { EventMetrics, EventPayload } from "../../../types/event";
import HomeEventsSectionStyle from "./HomeEventsSection.style";
import { useTranslations } from "next-intl";

interface HomeEventsSectionProps {
    events: EventPayload[];
    eventMetrics: EventMetrics;
}

const HomeEventsSection = ({
    events,
    eventMetrics,
}: HomeEventsSectionProps) => {
    const tEvents = useTranslations("events");

    if (!Array.isArray(events) || events.length === 0) {
        return null;
    }

    return (
        <HomeEventsSectionStyle container>
            <Box className="events-inner">
                <EventsGrid
                    events={events}
                    eventMetrics={eventMetrics}
                    t={tEvents}
                    title={tEvents("latestEvents")}
                    subtitle={tEvents("latestEventsSubtitle")}
                    buttonPosition="top"
                />
            </Box>
        </HomeEventsSectionStyle>
    );
};

export default HomeEventsSection;

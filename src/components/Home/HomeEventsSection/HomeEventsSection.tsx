import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import EventsGrid from "../../Event/EventList/EventGrid";
import { EventMetrics, EventPayload } from "../../../types/event";
import HomeEventsSectionStyle from "./HomeEventsSection.style";

interface HomeEventsSectionProps {
    events: EventPayload[];
    eventMetrics: EventMetrics;
}

const HomeEventsSection = ({
    events,
    eventMetrics,
}: HomeEventsSectionProps) => {
    const { t } = useTranslation();

    if (!Array.isArray(events) || events.length === 0) {
        return null;
    }

    return (
        <HomeEventsSectionStyle container>
            <Box className="events-inner">
                <EventsGrid
                    events={events}
                    eventMetrics={eventMetrics}
                    t={t}
                    title={t("events:latestEvents")}
                    subtitle={t("events:latestEventsSubtitle")}
                    buttonPosition="top"
                />
            </Box>
        </HomeEventsSectionStyle>
    );
};

export default HomeEventsSection;

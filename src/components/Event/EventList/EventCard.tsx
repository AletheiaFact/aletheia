import React from "react";
import { Grid } from "@mui/material";
import CardBase from "../../CardBase";
import { i18n } from "next-i18next";
import { EventPayload } from "../../../types/event";
import EventCardHeader from "./EventCardHeader";
import EventCardTitle from "./EventCardTitle";
import EventCardDateRange from "./EventCardDateRange";
import EventCardAction from "./EventCardAction";

interface EventCardProps {
    event: EventPayload;
    openEventLabel: string;
}

const EventCard = ({ event, openEventLabel }: EventCardProps) => {
    const currentLocale = i18n.language || "pt";
    return (
        <CardBase
            children={
                <Grid container padding={3} gap={3} justifyContent="center">
                    <EventCardHeader badge={event.badge} location={event.location} />
                    <EventCardTitle title={event.name} />
                    <EventCardDateRange
                        startDate={event.startDate}
                        endDate={event.endDate}
                        locale={currentLocale}
                    />
                    <EventCardAction
                        label={openEventLabel}
                        href={`/event/${event.data_hash}/${event.slug}`}
                    />
                </Grid>
            }
        />
    );
};

export default EventCard;

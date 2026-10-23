import React, { useRef } from "react";
import { Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { EventPayload, EventsActions, EventsState } from "../../../types/event";
import LargeDrawer from "../../LargeDrawer";
import DynamicEventForm, { EventFormValues } from "./DynamicEventForm";
import EventApi from "../../../api/eventApi";
import { draftsFromParticipants } from "../Participants/participantDrafts";
import { persistParticipants } from "../Participants/persistParticipants";
import { createParticipantsApi } from "../Participants/participantsApi";
import { Organization } from "../../../types/Organization";

interface EventDrawerProps {
    open: boolean;
    onClose: () => void;
    currentEvent: EventPayload;
    onSave: (updatedRequest: EventPayload) => void;
    state: EventsState;
    actions: EventsActions;
}

const EventDrawer = ({
    open,
    onClose,
    currentEvent,
    onSave,
    state,
    actions,
}: EventDrawerProps) => {
    const { t } = useTranslation();
    const { hasCaptcha, isLoading } = state;
    const { setRecaptchaString, setIsLoading } = actions;

    // Organizations created by a failed attempt, reused when retrying.
    const createdOrganizations = useRef(new Map<string, Organization>());

    const onSubmit = async ({
        participants: participantDrafts,
        ...formData
    }: EventFormValues) => {
        try {
            if (setIsLoading) setIsLoading(true);

            const eventId = currentEvent.id;

            if (!eventId) {
                throw new Error("Event ID not found");
            }

            // Only send participants when the form holds them, so an update
            // can never clear the list by omission.
            const prepared =
                participantDrafts &&
                (await persistParticipants(
                    participantDrafts,
                    createParticipantsApi(t),
                    createdOrganizations.current
                ));
            const response = await EventApi.updateEvent(
                eventId,
                {
                    ...formData,
                    ...(prepared && { participants: prepared.participants }),
                },
                t
            );
            await prepared?.commitEdits();

            if (response) {
                onSave(response);
            }
        } catch (error) {
            console.error("Error updating event:", error);
        } finally {
            if (setIsLoading) setIsLoading(false);
        }
    };

    const formattedEvent: EventFormValues = {
        ...currentEvent,
        participants: draftsFromParticipants(currentEvent.participants),
        mainTopic: {
            label: currentEvent.mainTopic.name,
            value: currentEvent.mainTopic.wikidataId,
            aliases: currentEvent.mainTopic.aliases || [],
            matchedAlias: null,
            displayLabel: currentEvent.mainTopic.name,
        },
    };

    return (
        <LargeDrawer open={open} onClose={onClose}>
            <Grid container style={{ padding: "30px" }}>
                <Typography variant="h2" fontSize={24}>
                    {t("events:titleEditEvent")}
                </Typography>
                <Divider />
                <DynamicEventForm
                    data={formattedEvent}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    setRecaptchaString={setRecaptchaString}
                    hasCaptcha={hasCaptcha}
                    isDrawerOpen={open}
                    onClose={onClose}
                />
            </Grid>
        </LargeDrawer>
    );
};

export default EventDrawer;

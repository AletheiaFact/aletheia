import React from "react";
import { Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { EventPayload, EventsActions, EventsState } from "../../../types/event";
import LargeDrawer from "../../LargeDrawer";
import DynamicEventForm from "./DynamicEventForm";
import EventApi from "../../../api/eventApi";

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
    actions
}: EventDrawerProps) => {
    const { t } = useTranslation();
    const { hasCaptcha, isLoading } = state;
    const { setRecaptchaString, setIsLoading } = actions;

    const onSubmit = async (formData: Partial<EventPayload>) => {
        try {
            if (setIsLoading) setIsLoading(true);

            const eventId = currentEvent.id;

            if (!eventId) {
                throw new Error("Event ID not found");
            }

            const response = await EventApi.updateEvent(eventId, formData, t);

            if (response) {
                onSave(response);
            }
        } catch (error) {
            console.error("Error updating event:", error);
        } finally {
            if (setIsLoading) setIsLoading(false);
        }
    };

    return (
        <LargeDrawer open={open} onClose={onClose}>
            <Grid container style={{ padding: "30px" }}>
                <Typography variant="h2" fontSize={24}>
                    {t("events:titleEditEvent")}
                </Typography>
                <Divider />
                <DynamicEventForm
                    data={currentEvent}
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

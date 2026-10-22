import React, { useRef } from "react";
import { Grid } from "@mui/material";
import colors from "../../../styles/colors";
import EventApi from "../../../api/eventApi";
import DynamicEventForm from "./DynamicEventForm";
import useEventsHook from "../hooks/useEventsHook";
import { persistParticipants } from "../Participants/persistParticipants";
import { createParticipantsApi } from "../Participants/participantsApi";
import { Organization } from "../../../types/Organization";

const CreateEventView = () => {
    const { state, actions } = useEventsHook();
    const { eventHref, nameSpace, isLoading, hasCaptcha, recaptchaString } =
        state;
    const { setRecaptchaString, t, router, setIsLoading } = actions;

    // Organizations created by a failed attempt, reused when retrying.
    const createdOrganizations = useRef(new Map<string, Organization>());

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const { participants, commitEdits } = await persistParticipants(
                data.participants,
                createParticipantsApi(t),
                createdOrganizations.current
            );
            const event = await EventApi.createEvent(
                {
                    nameSpace,
                    badge: data.badge,
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    mainTopic: data.mainTopic,
                    participants,
                    recaptcha: recaptchaString,
                },
                t
            );
            await commitEdits();
            router.push(`${eventHref}/${event.slug}`);
        } catch (err) {
            // The API helpers already showed an error message.
            console.error("Error creating event:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid
            container
            justifyContent="center"
            style={{ background: colors.lightNeutral }}
        >
            <Grid item xs={9} padding="30px 0px">
                <DynamicEventForm
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    setRecaptchaString={setRecaptchaString}
                    hasCaptcha={hasCaptcha}
                />
            </Grid>
        </Grid>
    );
};

export default CreateEventView;

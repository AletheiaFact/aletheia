import React from "react";
import { Grid } from "@mui/material";
import colors from "../../../styles/colors";
import EventApi from "../../../api/eventApi";
import DynamicEventForm from "./DynamicEventForm";
import useEventsHook from "../hooks/useEventsHook";

const CreateEventView = () => {
    const { state, actions } = useEventsHook()
    const { nameSpace, isLoading, hasCaptcha, recaptchaString } = state
    const { setRecaptchaString, t, router, setIsLoading } = actions

    const onSubmit = (data) => {
        const newEvent = {
            nameSpace,
            badge: data.badge,
            name: data.name,
            description: data.description,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            mainTopic: data.mainTopic,
            recaptcha: recaptchaString,
        };

        EventApi
            .createEvent(newEvent, router, t)
            .then((event) => {
                router.push(`/event/${event.data_hash}/${event.slug}`);
                setIsLoading(false);
            });
    };

    return (
        <Grid container justifyContent="center" style={{ background: colors.lightNeutral }}>
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

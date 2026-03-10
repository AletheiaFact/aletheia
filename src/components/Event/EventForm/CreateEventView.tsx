import React, { useState } from "react";
import { Grid } from "@mui/material";
import colors from "../../../styles/colors";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import EventApi from "../../../api/eventApi";
import DynamicEventForm from "./DynamicEventForm";

const CreateEventView = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;

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

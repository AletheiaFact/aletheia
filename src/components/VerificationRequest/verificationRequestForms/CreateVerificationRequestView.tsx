import React, { useState } from "react";
import { Grid } from "@mui/material";
import colors from "../../../styles/colors";
import DynamicVerificationRequestForm from "./DynamicVerificationRequestForm";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import verificationRequestApi from "../../../api/verificationRequestApi";

const CreateVerificationRequestView = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;

    const onSubmit = (data) => {
        const newVerificationRequest = {
            nameSpace,
            content: data.content,
            reportType: data.reportType,
            impactArea: data.impactArea,
            sourceChannel: "Web",
            source: [{ href: data.source }],
            publicationDate: data.publicationDate,
            email: data.email,
            date: new Date(),
            heardFrom: data.heardFrom,
            recaptcha: recaptchaString,
        };

        verificationRequestApi
            .createVerificationRequest(t, router, newVerificationRequest)
            .then((s) => {
                router.push(`/verification-request/${s.data_hash}`);
                setIsLoading(false);
            });
    };

    return (
        <Grid container justifyContent="center" style={{ background: colors.lightNeutral }}>
            <Grid item xs={9} padding="30px 0px">
                <DynamicVerificationRequestForm
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    setRecaptchaString={setRecaptchaString}
                    hasCaptcha={hasCaptcha}
                    isEdit={false}
                />
            </Grid>
        </Grid>
    );
};

export default CreateVerificationRequestView;

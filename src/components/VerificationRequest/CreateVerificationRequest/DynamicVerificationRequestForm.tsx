import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import BaseVerificationRequestForm from "./BaseVerificationRequestForm";
import verificationRequestApi from "../../../api/verificationRequestApi";

const DynamicVerificationRequestForm = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (values) => {
        if (!isLoading) {
            setIsLoading(true);
            const newVerificationRequest = values;
            verificationRequestApi
                .createVerificationRequest(t, router, newVerificationRequest)
                .then((s) => {
                    router.push(`/verification-request/${s.data_hash}`);
                    setIsLoading(false);
                });
            setIsLoading(false);
        }
    };

    return (
        <BaseVerificationRequestForm
            handleSubmit={handleSubmit}
            disableFutureDates
            isLoading={isLoading}
        />
    );
};

export default DynamicVerificationRequestForm;

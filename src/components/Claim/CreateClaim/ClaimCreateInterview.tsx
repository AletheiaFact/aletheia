import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import BaseClaimForm from "./BaseClaimForm";

const ClaimCreateInterview = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [_, send] = useAtom(createClaimMachineAtom);

    const handleSubmit = (values) => {
        if (!isLoading) {
            setIsLoading(true);
            send({
                type: CreateClaimEvents.persist,
                claimData: values,
                t,
                router,
            });
            setIsLoading(false);
        }
    };

    return (
        <BaseClaimForm
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            dateExtraText={t("claimForm:dateFieldHelpInterview")}
        />
    );
};

export default ClaimCreateInterview;

import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import personalityApi from "../../api/personality";
import claimApi from "../../api/claim";
import ClaimCard from "../Claim/ClaimCard";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import { GlobalStateContext } from "../Editor/CallbackTimerProvider";
import { useActor } from "@xstate/react";

const ClaimCollectionClaimCardWrapper = ({ personalityId, claimId }) => {
    const [personality, setPersonality] = useState();
    const [claim, setClaim] = useState();
    const { t } = useTranslation();
    const { timerService } = useContext<any>(GlobalStateContext);
    const [state]: any = useActor<any>(timerService);

    useLayoutEffect(() => {
        if (claimId) {
            claimApi.getById(claimId, t).then(setClaim);
        }
    }, [state]);
    useEffect(() => {
        if (personalityId) {
            personalityApi
                .getPersonality(personalityId, { language: "pt" }, t)
                .then(setPersonality);
        }
        if (claimId) {
            claimApi.getById(claimId, t).then(setClaim);
        }
    }, [personalityId, claimId]);

    return claim && personality ? (
        <ClaimCard personality={personality} claim={claim} collapsed={false} />
    ) : (
        <ClaimSkeleton />
    );
};

export default ClaimCollectionClaimCardWrapper;

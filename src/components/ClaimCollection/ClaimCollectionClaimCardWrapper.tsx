import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useLayoutEffect, useState } from "react";

import claimApi from "../../api/claim";
import personalityApi from "../../api/personality";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
import ClaimCard from "../Claim/ClaimCard";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";

const ClaimCollectionClaimCardWrapper = ({ personalityId, claimId }) => {
    const [personality, setPersonality] = useState();
    const [claim, setClaim] = useState();
    const { t } = useTranslation();
    const [state] = useAtom(callbackTimerAtom);

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
    }, [personalityId, claimId, t]);

    return claim && personality ? (
        <ClaimCard personality={personality} claim={claim} collapsed={false} />
    ) : (
        <ClaimSkeleton />
    );
};

export default ClaimCollectionClaimCardWrapper;

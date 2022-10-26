import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import personalityApi from "../../api/personality";
import claimApi from "../../api/claim";
import ClaimCard from "../Claim/ClaimCard";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";

const ClaimCollectionClaimCardWrapper = ({ personalityId, claimId }) => {
    const [personality, setPersonality] = useState();
    const [claim, setClaim] = useState();
    const { t } = useTranslation();
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

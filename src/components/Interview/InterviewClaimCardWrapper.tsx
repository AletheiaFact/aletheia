import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import personalityApi from "../../api/personality";
import ClaimCard from "../Claim/ClaimCard";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";

const InterviewClaimCardWrapper = ({ personalityId, speech }) => {
    const [personality, setPersonality] = useState();
    const { t } = useTranslation();
    useEffect(() => {
        if (personalityId) {
            personalityApi
                .getPersonality(personalityId, { language: "pt" }, t)
                .then(setPersonality);
        }
    }, [personalityId, t]);

    return speech && personality ? (
        <ClaimCard personality={personality} claim={speech} collapsed={false} />
    ) : (
        <ClaimSkeleton />
    );
};

export default InterviewClaimCardWrapper;

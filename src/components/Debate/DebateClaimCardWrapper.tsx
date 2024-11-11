import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import personalityApi from "../../api/personality";
import ClaimCard from "../Claim/ClaimCard";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const DebateClaimCardWrapper = ({ personalityId, speech }) => {
    const [personality, setPersonality] = useState();
    const [nameSpace] = useAtom(currentNameSpace);
    const { t } = useTranslation();
    useEffect(() => {
        if (personalityId) {
            personalityApi
                .getPersonality(personalityId, { language: "pt", nameSpace }, t)
                .then(setPersonality);
        }
    }, [personalityId, t]);

    return speech && personality ? (
        <ClaimCard personality={personality} claim={speech} collapsed={false} />
    ) : (
        <ClaimSkeleton />
    );
};

export default DebateClaimCardWrapper;

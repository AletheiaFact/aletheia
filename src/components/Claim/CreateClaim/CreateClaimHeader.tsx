import React from "react";
import DebateHeader from "../../Debate/DebateHeader";
import PersonalityCard from "../../Personality/PersonalityCard";

export const CreateClaimHeader = ({ claimData }) => {
    return claimData.personalities?.length > 1 ? (
        <DebateHeader personalities={claimData.personalities} title="" />
    ) : (
        <PersonalityCard
            personality={claimData.personalities[0]}
            header={true}
            mobile={true}
        />
    );
};

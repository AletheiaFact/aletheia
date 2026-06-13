import React from "react";
import CommitteInvitationHero from "./sections/CommitteInvitationHero";
import CommitteInvitationOurMission from "./sections/CommitteInvitationOurMission";
import CommitteInvitationBenefits from "./sections/CommitteInvitationBenefits";
import CommitteInvitationCTA from "./sections/CommitteInvitationCTA";
import { CommitteInvitationBoxStyle } from "./CommitteInvitationPage.style";

const CommitteInvitationPage = () => {
    return (
        <CommitteInvitationBoxStyle component="main">
            <CommitteInvitationHero />
            <CommitteInvitationOurMission />
            <CommitteInvitationBenefits />
            <CommitteInvitationCTA />
        </CommitteInvitationBoxStyle>
    );
};

export default CommitteInvitationPage;

import React from "react";
import CommitteInvitationHero from "./sections/CommitteInvitationHero";
import CommitteInvitationOurMission from "./sections/CommitteInvitationOurMission";
import CommitteInvitationBenefits from "./sections/CommitteInvitationBenefits";
import CommitteInvitationCTA from "./sections/CommitteInvitationCTA";
import { CommitteInvitationBoxStyle } from "./CommitteInvitationPage.style";
import CommitteInvitationForm from "./sections/CommitteInvitationForm/CommitteInvitationForm";

const CommitteInvitationPage = () => {
    return (
        <CommitteInvitationBoxStyle component="main">
            <CommitteInvitationHero />
            <CommitteInvitationOurMission />
            <CommitteInvitationBenefits />
            <CommitteInvitationCTA />
            <CommitteInvitationForm />
        </CommitteInvitationBoxStyle>
    );
};

export default CommitteInvitationPage;

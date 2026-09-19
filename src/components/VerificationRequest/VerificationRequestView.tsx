import React from "react";
import { useAtom } from "jotai";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import { useVerificationRequestFilters } from "./useVerificationRequestFilters";
import VerificationRequestDashboard from "./Dashboard/VerificationRequestDashboard";
import VerificationRequestGrid from "./VerificationrequestView.style";
import VerificationRequestHeader from "./VerificationRequestHeader";
import VerificationRequestFilters from "./VerificationRequestFilters";
import Loading from "../Loading";
import { isAuthResolved } from "../../atoms/currentUser";

const VerificationRequestView = () => {
    const { state, actions } = useVerificationRequestFilters();
    const { viewMode, canViewBoard } = state;
    const [authResolved] = useAtom(isAuthResolved);

    if (!authResolved) {
        return <Loading />
    }

    return (
        <VerificationRequestGrid container>
            <VerificationRequestHeader />
            <VerificationRequestFilters state={state} actions={actions} />
            {canViewBoard && viewMode === "left" && (
                <VerificationRequestBoardView state={state} actions={actions} />
            )}
            {(viewMode === "right" || !canViewBoard) && (
                <VerificationRequestDashboard canViewBoard={canViewBoard} />
            )}
        </VerificationRequestGrid>
    );
};

export default VerificationRequestView;

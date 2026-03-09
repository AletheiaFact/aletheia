import React from "react";
import FilterManager from "./FilterManagers";
import ActiveFilters from "./ActiveFilters";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import { useVerificationRequestFilters } from "./VerificationRequestFilters";
import VerificationRequestDashboard from "./Dashboard/VerificationRequestDashboard";
import VerificationRequestGrid from "./VerificationrequestView.style";

const VerificationRequestView = () => {
    const { state, actions } = useVerificationRequestFilters();
    const { viewMode } = state;

    return (
        <VerificationRequestGrid container>
            <FilterManager state={state} actions={actions} />
            <ActiveFilters state={state} actions={actions} />
            {viewMode === "left" && (
                <VerificationRequestBoardView state={state} actions={actions} />
            )}
            {viewMode === "right" && <VerificationRequestDashboard />}
        </VerificationRequestGrid>
    );
};

export default VerificationRequestView;

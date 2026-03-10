import React from "react";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import { useVerificationRequestFilters } from "./useVerificationRequestFilters";
import VerificationRequestDashboard from "./Dashboard/VerificationRequestDashboard";
import VerificationRequestGrid from "./VerificationrequestView.style";
import VerificationRequestHeader from "./VerificationRequestHeader";
import VerificationRequestFilters from "./VerificationRequestFilters";

const VerificationRequestView = () => {
  const { state, actions } = useVerificationRequestFilters();
  const { viewMode } = state;

  return (
    <VerificationRequestGrid container>
      <VerificationRequestHeader />
      <VerificationRequestFilters state={state} actions={actions} />
      {viewMode === "left" && (
        <VerificationRequestBoardView state={state} actions={actions} />
      )}
      {viewMode === "right" && <VerificationRequestDashboard />}
    </VerificationRequestGrid>
  );
};

export default VerificationRequestView;

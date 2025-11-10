import React from "react";
import { Grid } from "@mui/material";
import FilterManager from "./FilterManagers";
import ActiveFilters from "./ActiveFilters";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import { useVerificationRequestFilters } from "./VerificationRequestFilters";
import VerificationRequestDashboard from "./VerificationRequestDashboard";

const VerificationRequestView = () => {
  const { state, actions } = useVerificationRequestFilters();
  const { viewMode } = state;

  return (
    <Grid container justifyContent="center">
      <FilterManager state={state} actions={actions} />
      <ActiveFilters state={state} actions={actions} />
      {viewMode === "board" && (
        <VerificationRequestBoardView state={state} actions={actions} />
      )}
      {viewMode === "dashboard" && <VerificationRequestDashboard />}
    </Grid>
  );
};

export default VerificationRequestView;

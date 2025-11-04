import React from "react";
import { Grid } from "@mui/material";
import FilterManager from "./FilterManagers";
import ActiveFilters from "./ActiveFilters";
import VerificationRequestListContent from "./VerificationRequestListContent";
import { useVerificationRequestFilters } from "./VerificationRequestFilters";

const VerificationRequestList = () => {
  const { state, actions } = useVerificationRequestFilters();
  return (
    <Grid container spacing={2} justifyContent="center">
      <FilterManager state={state} actions={actions} />
      <ActiveFilters state={state} actions={actions} />
      <VerificationRequestListContent state={state} actions={actions} />
    </Grid>
  );
};

export default VerificationRequestList;

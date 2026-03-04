import React from "react";
import { Grid } from "@mui/material";
import FilterManager from "./FilterManagers";
import ActiveFilters from "./ActiveFilters";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import { useVerificationRequestFilters } from "./VerificationRequestFilters";
import VerificationRequestDashboard from "./Dashboard/VerificationRequestDashboard";
import Paragraph from "../Paragraph";
import { useTranslation } from "react-i18next";

const VerificationRequestView = () => {
  const { state, actions } = useVerificationRequestFilters();
  const { viewMode } = state;
  const { t } = useTranslation();

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={7}>
        <h1 style={{ fontSize: 32 }}>
          {t("verificationRequest:verificationRequestListHeader")}
        </h1>
        <Paragraph>{t("verificationRequest:verificationRequestDescription")}</Paragraph>
      </Grid>
      <Grid item xs={12} md={7}>
        <FilterManager state={state} actions={actions} />
        <ActiveFilters state={state} actions={actions} />
      </Grid>

      {viewMode === "board" && (
        <VerificationRequestBoardView state={state} actions={actions} />
      )}
      {viewMode === "dashboard" && <VerificationRequestDashboard />}
    </Grid>
  );
};

export default VerificationRequestView;

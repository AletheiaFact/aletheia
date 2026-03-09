import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import FilterManager from "./FilterManagers";
import ActiveFilters from "./ActiveFilters";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import { useVerificationRequestFilters } from "./VerificationRequestFilters";
import VerificationRequestDashboard from "./Dashboard/VerificationRequestDashboard";
import { useTranslation } from "react-i18next";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";

const VerificationRequestView = () => {
  const { state, actions } = useVerificationRequestFilters();
  const { viewMode } = state;
  const { t } = useTranslation();
  const { vw } = useAppSelector((state) => state);

  return (
    <Grid container style={{ marginTop: "64px", justifyContent: "center" }}>
      <Grid item xs={12} md={5} style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: "16px" }} >
        <Typography variant="h1" style={{ fontWeight: "bold", maxWidth: 900, fontSize: "40px" }}>
          {t("verificationRequest:verificationRequestListHeader")}
        </Typography>
        <Typography variant="body1" style={{ textAlign: "center", padding: vw?.xs ? "0 16px" : "0" }}>
          {t("verificationRequest:verificationRequestDescription")}
        </Typography>
      </Grid>

      <Box
        style={{
          width: "100%",
          borderTop: `2px solid ${colors.neutralTertiary}`,
          borderBottom: `2px solid ${colors.neutralTertiary}`,
          backgroundColor: colors.lightNeutralSecondary,
          marginTop: "34px",
          display: "flex",
          alignItems: "center",
        }}>
        <Grid container justifyContent={"center"}>
          <Grid item xs={12} md={8} style={{ display: "flex", alignItems: "center", }}>
            <FilterManager state={state} actions={actions} />
            <ActiveFilters state={state} actions={actions} />
          </Grid>
        </Grid>
      </Box>
      {viewMode === "board" && (
        <VerificationRequestBoardView state={state} actions={actions} />
      )}
      {viewMode === "dashboard" && <VerificationRequestDashboard />}
    </Grid>
  );
};

export default VerificationRequestView;

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Paper,
} from "@mui/material";
import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";
import { VerificationRequestStatus } from "../../types/enums";
import VerificationRequestDetailDrawer from "./VerificationRequestDetailDrawer";
import {
  getSeverityColor,
  getSeverityLabel,
} from "../../helpers/verificationRequestCardHelper";

const VerificationRequestBoardView = ({ state, actions }) => {
  const { loading, filteredRequests, totalVerificationRequests, paginationModel } = state;
  const { fetchData, setPaginationModel } = actions;
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const statuses = [
    { key: VerificationRequestStatus.PRE_TRIAGE, label: t("verificationRequest:PRE_TRIAGE") },
    { key: VerificationRequestStatus.IN_TRIAGE, label: t("verificationRequest:IN_TRIAGE") },
    { key: VerificationRequestStatus.POSTED, label: t("verificationRequest:POSTED") },
  ];

  const handleCardClick = (request: any) => {
    setSelectedRequest(request);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedRequest(null);
  };

  const handleRequestUpdate = (newStatus) => {
    setSelectedRequest(null);
    fetchData(newStatus);
  };

  useEffect(() => {
    for (const status in paginationModel) {
      fetchData(status);
    }
  }, [paginationModel]);

  const groupedRequests = Object.fromEntries(
    statuses.map(({ key }) => [key, filteredRequests[key]])
  );

  const groupedTotalRequests = Object.fromEntries(
    statuses.map(({ key }) => [key, totalVerificationRequests[key]])
  );

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ width: "100%", p: 2, backgroundColor: colors.lightNeutralSecondary }}>
      <Grid container spacing={2} justifyContent="center">
        {statuses.map((status) => (
          <Grid item xs={12} md={4} key={status.key}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: colors.lightNeutral,
                minHeight: "600px",
                maxHeight: "80vh",
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  display: "flex",
                  fontWeight: "bold",
                  justifyContent: "space-between",
                  color: colors.primary,
                  borderBottom: `2px solid ${colors.secondary}`,
                  pb: 1,
                }}
              >
                <Grid item>
                  {status.label}
                  <Chip
                    label={groupedRequests[status.key].length}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Grid>
                <Typography
                  variant="body2"
                  color={colors.blackSecondary}
                  alignContent="flex-end"
                >
                  {t("list:totalItems", {
                    total: groupedTotalRequests[status.key],
                  })}
                </Typography>
              </Typography>

              {loading[status.key] ? (
                <Typography variant="body2" color={colors.blackSecondary}>
                  {t("common:loading")}
                </Typography>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {groupedRequests[status.key].map((request) => (
                    <Card
                      key={request._id}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 3,
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => handleCardClick(request)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Chip
                            label={getSeverityLabel(request.severity, t)}
                            size="small"
                            sx={{
                              backgroundColor: getSeverityColor(
                                request.severity
                              ),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(request.date)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body1"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          {truncateText(request.content, 80)}
                        </Typography>

                        {request.reportType && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            <strong>
                              {t("verificationRequest:tagReportType")}:
                            </strong>{" "}
                            {t(`claimForm:${request.reportType}`)}
                          </Typography>
                        )}

                        {request.impactArea?.name && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            <strong>
                              {t("verificationRequest:tagImpactArea")}:
                            </strong>{" "}
                            {request.impactArea.name}
                          </Typography>
                        )}

                        {request.sourceChannel && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            <strong>
                              {t("verificationRequest:tagSourceChannel")}:
                            </strong>{" "}
                            {truncateText(
                              t(
                                `verificationRequest:${request.sourceChannel}`,
                                { defaultValue: request.sourceChannel },
                              ),
                              30,
                            )}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <AletheiaButton
                            href={`/verification-request/${request.data_hash}`}
                            target="_blank"
                          >
                            {t("verificationRequest:openVerificationRequest")}
                          </AletheiaButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  {groupedTotalRequests[status.key] > paginationModel[status.key].pageSize && (
                    <AletheiaButton
                      type={ButtonType.gray}
                      onClick={() => {
                        setPaginationModel((prev) => {
                          const updated = {
                            ...prev,
                            [status.key]: {
                              ...prev[status.key],
                              pageSize: prev[status.key].pageSize + 20,
                            },
                          };
                          return updated;
                        });
                      }}
                      data-cy={"testLoadMoreVerificationRequest"}
                    >
                      {t("list:loadMoreButton")}
                    </AletheiaButton>
                  )}
                  {groupedTotalRequests[status.key] === 0 && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      {t("verificationRequest:noRequestsInStatus")}
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <VerificationRequestDetailDrawer
        verificationRequest={selectedRequest}
        open={drawerOpen}
        onClose={handleDrawerClose}
        onUpdate={handleRequestUpdate}
      />
    </Box>
  );
};

export default VerificationRequestBoardView;

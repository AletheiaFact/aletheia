import React, { useMemo, useState } from "react";
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
import AletheiaButton from "../Button";
import { SeverityEnum } from "../../../server/verification-request/dto/types";
import {
  SeverityLevel,
  VerificationRequestBoardViewProps,
} from "../../types/VerificationRequest";
import VerificationRequestDetailDrawer from "./VerificationRequestDetailDrawer";

const SEVERITY_COLOR_MAP: Record<SeverityLevel, string> = {
  low: colors.low,
  medium: colors.medium,
  high: colors.high,
  critical: colors.critical,
};

const VerificationRequestBoardView: React.FC<VerificationRequestBoardViewProps> =
  ({ requests, loading, onRequestUpdated }) => {
    const { t } = useTranslation();
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const statuses = [
      { key: "Pre Triage", label: t("verificationRequest:statusPreTriage") },
      { key: "In Triage", label: t("verificationRequest:statusInTriage") },
      { key: "Posted", label: t("verificationRequest:statusPosted") },
    ];

    const handleCardClick = (request: any) => {
      setSelectedRequest(request);
      setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedRequest(null);
    };

    const handleRequestUpdate = () => {
        setSelectedRequest(null);
        if (onRequestUpdated) onRequestUpdated();
    };

    const groupedRequests = useMemo(() => {
      const grouped = statuses.reduce((acc, status) => {
        acc[status.key] = [];
        return acc;
      }, {} as Record<string, any[]>);

      for (const request of requests) {
        const status = request.status || "Pre Triage";
        if (grouped[status]) {
          grouped[status].push(request);
        }
      }

      return grouped;
    }, [requests, statuses]);

    const getSeverityColor = (severity: SeverityEnum | undefined): string => {
      if (!severity) return colors.neutralSecondary;

      const severityStr = String(severity);

      let severityLevel: SeverityLevel;

      if (severityStr.startsWith("low")) severityLevel = "low";
      else if (severityStr.startsWith("medium")) severityLevel = "medium";
      else if (severityStr.startsWith("high")) severityLevel = "high";
      else if (severityStr === "critical") severityLevel = "critical";
      else severityLevel = "low";

      return SEVERITY_COLOR_MAP[severityLevel];
    };

    const formatSeverityLabel = (severity: string) => {
      if (!severity) return "N/A";
      const parts = severity.split("_");
      if (parts.length === 2) {
        return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} (${
          parts[1]
        })`;
      }
      return severity.charAt(0).toUpperCase() + severity.slice(1);
    };

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
      <Box sx={{ width: "100%", p: 2 }}>
        <Grid container spacing={2}>
          {statuses.map((status) => (
            <Grid item xs={12} sm={6} md={4} key={status.key}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: colors.lightNeutralSecondary,
                  minHeight: "600px",
                  maxHeight: "80vh",
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: colors.primary,
                    borderBottom: `2px solid ${colors.secondary}`,
                    pb: 1,
                  }}
                >
                  {status.label}
                  <Chip
                    label={groupedRequests[status.key].length}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>

                {loading ? (
                  <Typography variant="body2" color="textSecondary">
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
                              label={formatSeverityLabel(request.severity)}
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
                              {truncateText(request.sourceChannel, 30)}
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

                    {groupedRequests[status.key].length === 0 && (
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

import {
  CheckCircle,
  Description,
  HourglassEmpty,
  Schedule,
} from "@mui/icons-material";
import { Box, Card, Grid, Typography } from "@mui/material";
import { StatsCount } from "../../../types/VerificationRequest";
import { useTranslation } from "next-i18next";

const VerificationRequestCounts = ({
  total,
  verified,
  inAnalysis,
  pending,
  totalThisMonth,
}: StatsCount) => {
  const { t } = useTranslation("verificationRequest");

  const statsCards = [
    {
      icon: <Description />,
      label: t("dashboard.totalReports"),
      value: total,
      subLabel: `${
        total > 0 ? ((totalThisMonth / total) * 100).toFixed(1) : "0.0"
      }% ${t("dashboard.receivedThisMonth")}`,
    },
    {
      icon: <CheckCircle />,
      label: t("dashboard.verified"),
      value: verified,
      subLabel: `${((verified / total) * 100).toFixed(1)}% ${t(
        "dashboard.ofTotal"
      )}`,
    },
    {
      icon: <Schedule />,
      label: t("dashboard.inAnalysis"),
      value: inAnalysis,
      subLabel: `${((inAnalysis / total) * 100).toFixed(1)}% ${t(
        "dashboard.ofTotal"
      )}`,
    },
    {
      icon: <HourglassEmpty />,
      label: t("dashboard.pending"),
      value: pending,
      subLabel: `${((pending / total) * 100).toFixed(1)}% ${t(
        "dashboard.ofTotal"
      )}`,
    },
  ];

  return (
    <Grid container spacing={3} mb={4}>
      {statsCards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Card className="card">
              <Box className="stats-header">
                <Box className="stats-icon-wrapper">{card.icon}</Box>
              </Box>
              <Typography className="value">
                {card.value.toLocaleString()}
              </Typography>
              <Typography className="stats-label">{card.label}</Typography>
              <Typography className="stats-label" style={{ fontSize: "12px" }}>
                {card.subLabel}
              </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default VerificationRequestCounts;

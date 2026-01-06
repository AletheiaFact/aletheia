import { Box, Typography } from "@mui/material";
import { Bar } from "./VerificationRequestDashboard.style";
import colors from "../../../styles/colors";
import { useTranslation } from "next-i18next";
import { StatsCount } from "../../../types/VerificationRequest";

const StatusDistribution = ({ verified, inAnalysis, pending }: StatsCount) => {
  const { t } = useTranslation("verificationRequest");

  const data = [
    {
      key: "verified",
      value: verified,
      color: colors.primary,
    },
    {
      key: "inAnalysis",
      value: inAnalysis,
      color: colors.secondary,
    },
    {
      key: "pending",
      value: pending,
      color: colors.neutralSecondary,
    },
  ];

  const maxStatusValue = Math.max(...data.map((item) => item.value));

  return (
    <>
      <Typography className="title">{t("dashboard.statusTitle")}</Typography>
      <Typography className="subtitle">
        {t("dashboard.statusSubtitle")}
      </Typography>

      <Box className="BarChart-container">
        {data.map(({ key, value, color }) => (
          <Box className="wrapper" key={key}>
            <Typography className="value">{value}</Typography>

            <Bar height={(value / maxStatusValue) * 100} color={color} />

            <Typography className="subtitle">
              {t(`dashboard.${key}`)}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};

export { StatusDistribution };

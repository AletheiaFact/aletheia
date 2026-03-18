import { Box } from "@mui/material";
import { EventMetrics } from "../../../types/event";
import colors from "../../../styles/colors";
import { useTranslation } from "next-i18next";
import MetricBox from "./MetricBox";

interface EventMetricsChipProps {
  eventMetrics?: EventMetrics;
}

const EventMetricsChip = ({ eventMetrics }: EventMetricsChipProps) => {
  const { t } = useTranslation();

  const metrics = eventMetrics || {
    reviews: 0,
    verificationRequests: 0,
    claims: 0,
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
        width: "100%",
      }}
    >
      <MetricBox
        value={metrics.reviews}
        label={t("events:reviewStats")}
        color={colors.lightPrimary}
        dataCy="testEventMetricsReviews"
      />
      <MetricBox
        value={metrics.verificationRequests}
        label={t("events:verificationRequestsStats")}
        color={colors.low}
        dataCy="testEventMetricsVerificationRequests"
      />
      <MetricBox
        value={metrics.claims}
        label={t("events:claimsStats")}
        color={colors.error}
        dataCy="testEventMetricsClaims"
      />
    </Box>
  );
};

export default EventMetricsChip;

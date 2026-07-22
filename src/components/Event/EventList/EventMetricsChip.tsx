import { Box } from "@mui/material";
import { EventMetrics } from "../../../types/event";
import colors from "../../../styles/colors";
import MetricBox from "./MetricBox";
import { useTranslations } from "next-intl";

interface EventMetricsChipProps {
  eventMetrics?: EventMetrics;
}

const EventMetricsChip = ({ eventMetrics }: EventMetricsChipProps) => {
  const tEvents = useTranslations("events");

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
        label={tEvents("reviewStats")}
        color={colors.lightPrimary}
        dataCy="testEventMetricsReviews"
      />
      <MetricBox
        value={metrics.verificationRequests}
        label={tEvents("verificationRequestsStats")}
        color={colors.low}
        dataCy="testEventMetricsVerificationRequests"
      />
      <MetricBox
        value={metrics.claims}
        label={tEvents("claimsStats")}
        color={colors.error}
        dataCy="testEventMetricsClaims"
      />
    </Box>
  );
};

export default EventMetricsChip;

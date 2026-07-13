import { Box, Card, CardContent, Typography } from "@mui/material";
import { StatsRecentActivityProps } from "../../../types/VerificationRequest";
import { formatTimeAgo } from "../../../helpers/formatTimeAgo";
import { getStatusStyles } from "../../../helpers/verificationRequestCardHelper";
import { useTranslations } from "next-intl";

const VerificationRequestActivity = ({
  statsRecentActivity,
}: StatsRecentActivityProps) => {
  const tVerificationRequest = useTranslations("verificationRequest");
  const t = useTranslations() as any;

  return (
    <Card className="card">
      <CardContent className="card-content">
        <Typography className="title">
          {tVerificationRequest("dashboard.activityTitle")}
        </Typography>
        <Typography className="subtitle">
          {tVerificationRequest("dashboard.activitySubtitle")}
        </Typography>

        <Box mt={2}>
          {statsRecentActivity.map((activity) => {
            const { color, label } = getStatusStyles(activity.status);

            const message = tVerificationRequest(`activity.${activity.status}`, {
              hash: activity.data_hash,
              source: tVerificationRequest(
                `${activity.sourceChannel}`,
                // activity.sourceChannel
              ).toLowerCase(),
            });

            return (
              <Box className="item" key={activity.id}>
                <Typography className="badge" variant="body2" bgcolor={color}>
                  {tVerificationRequest(`${label}`)}
                </Typography>
                <Typography className="legend-label">{message}</Typography>
                <Typography className="legend-percentage">
                  {formatTimeAgo(activity.timestamp, t)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default VerificationRequestActivity;

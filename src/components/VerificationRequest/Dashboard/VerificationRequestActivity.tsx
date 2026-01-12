import { Box, Card, CardContent, Typography } from "@mui/material";
import colors from "../../../styles/colors";
import { StatsRecentActivityProps } from "../../../types/VerificationRequest";
import { useTranslation } from "next-i18next";
import { formatTimeAgo } from "../../../helpers/formatTimeAgo";

const VerificationRequestActivity = ({
  statsRecentActivity,
}: StatsRecentActivityProps) => {
  const { t } = useTranslation();
  
  const STATUS_CONFIG = {
    Posted: {
      color: colors.low,
      labelKey: "statusPosted",
    },
    "In Triage": {
      color: colors.medium,
      labelKey: "statusInTriage",
    },
    "Pre Triage": {
      color: colors.neutralSecondary,
      labelKey: "statusPreTriage",
    },
    Declined: {
      color: colors.error,
      labelKey: "statusDeclined",
    },
  } as const;

  return (
    <Card className="card">
      <CardContent className="card-content">
        <Typography className="title">
          {t("verificationRequest:dashboard.activityTitle")}
        </Typography>
        <Typography className="subtitle">
          {t("verificationRequest:dashboard.activitySubtitle")}
        </Typography>

        <Box mt={2}>
          {statsRecentActivity.map((activity) => {
            const { color, labelKey } = STATUS_CONFIG[activity.status];

            const message = t(`verificationRequest:activity.${activity.status}`, {
              hash: activity.data_hash,
              source: t(
                `verificationRequest:${activity.sourceChannel}`,
                activity.sourceChannel
              ).toLowerCase(),
            });

            return (
              <Box className="item" key={activity.id}>
                <Typography className="badge" variant="body2" bgcolor={color}>
                  {t(`verificationRequest:${labelKey}`)}
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

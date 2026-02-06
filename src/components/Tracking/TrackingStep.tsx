import * as React from "react";
import { Grid, Typography } from "@mui/material";
import LocalizedDate from "../LocalizedDate";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { TrackingStepProps } from "../../types/Tracking";
import { StepLabelStyled } from "./StepLabel.style";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

const STEP_STATES = {
  declined: {
    bg: colors.errorTranslucent,
    color: colors.error,
    Icon: CancelIcon,
  },
  completed: {
    bg: colors.activeTranslucent,
    color: colors.active,
    Icon: CheckCircleIcon,
  },
  pending: {
    bg: colors.lightNeutral,
    color: colors.neutralSecondary,
    Icon: PendingIcon,
  },
};

const TrackingStep = ({
  stepKey,
  stepDate,
  isCompleted,
  isDeclined,
}: TrackingStepProps) => {
  const { t } = useTranslation();

  const currentState = isDeclined ? "declined" : isCompleted ? "completed" : "pending";
  const { bg, color, Icon } = STEP_STATES[currentState];

  const translationKey = stepKey.toUpperCase().replace(/ /g, "_");

  return (
    <StepLabelStyled
      icon={<Icon style={{ color }} />}
      error={isDeclined}
      backgroundStatusColor={bg}
      iconColor={color}
    >
      <Grid container className="stepItem">
        <Typography variant="subtitle2" className="stepLabel">
          {t(`verificationRequest:${translationKey}`)}
        </Typography>

        {stepDate && (
          <Typography variant="caption" className="dateLabel">
            <LocalizedDate date={stepDate} showTime />
          </Typography>
        )}
      </Grid>

      <Typography variant="body2" className="description">
        {t(`tracking:description_${translationKey}`)}
      </Typography>
    </StepLabelStyled>
  );
};

export default TrackingStep;
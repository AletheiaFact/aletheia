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

const getIcons = (isCompleted: boolean, isDeclined: boolean) => {
  if (isDeclined)
    return {
      backgroundColor: colors.errorTranslucent,
      iconColor: colors.error,
      IconComponent: <CancelIcon style={{ color: colors.error }} />,
    };
  if (isCompleted)
    return {
      backgroundColor: colors.activeTranslucent,
      iconColor: colors.active,
      IconComponent: <CheckCircleIcon style={{ color: colors.active }} />,
    };
  return {
    backgroundColor: colors.lightNeutral,
    iconColor: colors.neutralSecondary,
    IconComponent: <PendingIcon style={{ color: colors.neutralSecondary }} />,
  };
};

const TrackingStep: React.FC<TrackingStepProps> = ({
  stepKey,
  stepDate,
  isCompleted,
  isDeclined,
}) => {
  const { t } = useTranslation();
  const stepLabel = stepKey.toUpperCase().replace(/ /g, '_');
  const { backgroundColor, iconColor, IconComponent } = getIcons(isCompleted, isDeclined);

  return (
    <StepLabelStyled
      icon={IconComponent}
      error={isDeclined}
      backgroundStatusColor={backgroundColor}
      iconColor={iconColor}
    >
      <Grid container className="stepItem">
        <Typography
          variant="subtitle2"
          className="stepLabel"
        >
          {t(`verificationRequest:${stepLabel}`)}
        </Typography>
        {stepDate && (
          <Typography
            variant="caption"
            className="dateLabel"
          >
            <LocalizedDate date={stepDate} showTime />
          </Typography>
        )}
      </Grid>
      <Typography
        variant="body2"
        className="description"
      >
        {t(`tracking:description_${stepLabel}`)}
      </Typography>
    </StepLabelStyled>
  );
};

export default TrackingStep;
import styled from "styled-components";
import colors from "../../styles/colors";
import StepLabel from "@mui/material/StepLabel";
import { StepLabelStyledProps } from "../../types/Tracking";

export const StepLabelStyled = styled(StepLabel) <StepLabelStyledProps>`
& .MuiStepLabel-label {
    padding: 4px 8px;
    border-radius: 8px;
  }

  .stepItem {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 6px;
  }

  .stepLabel {
    color: ${colors.blackSecondary};
    background-color: ${({ backgroundStatusColor }) => backgroundStatusColor};
    border-radius: 4px;
    padding: 2px 6px;
  }

  .dateLabel {
    color: ${colors.blackSecondary};
    background-color: ${colors.lightNeutral};
    border-radius: 4px;
    padding: 2px 6px;
  }

  .description {
    color: ${colors.blackSecondary};
    background-color: ${({ backgroundStatusColor }) => backgroundStatusColor};
    border-radius: 4px;
    padding: 8px 6px;
    border-left: 4px solid;
    border-left-color: ${({ iconColor }) => iconColor}
  }
`;

import styled from "styled-components";
import Box from "@mui/material/Box";
import colors from "../../../styles/colors";

const VerificationCardStyled = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: clamp(16px, 4vw, 24px);
    border-radius: 12px;
    gap: clamp(12px, 3vh, 16px);
    width: 100%;

  .verification-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .verification-info-text {
    color: ${colors.secondary};
    font-size: clamp(10px, 1.2vw, 12px);
  }

  .verification-info-status-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .verification-info-status-label {
    color: ${colors.secondary};
    font-weight: 500;
    font-size: clamp(14px, 2vw, 16px);
  }

  .verification-info-status-value {
    color: ${colors.high};
    font-weight: 700;
  }

  .sentence-content {
    background-color: color-mix(in srgb, ${colors.lightNeutralSecondary}, transparent 60%);
    padding: clamp(8px, 2vw, 12px);
    border-radius: 4px;
  }

  .verification-actions {
    display: grid;
    border-top: 1px solid ${colors.lightNeutral};
    padding-top: 8px;
  }

  .verification-actions-caption {
    color: ${colors.secondary};
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .verification-actions-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .verification-actions-avatars {
    display: flex;
    gap: 4px;
  }
`;

export default VerificationCardStyled

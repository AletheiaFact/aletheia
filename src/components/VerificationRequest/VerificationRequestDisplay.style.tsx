import styled from "styled-components";
import { Grid } from "@mui/material";
import colors from "../../styles/colors";

const VerificationRequestDisplayStyle = styled(Grid)`
    display: flex;
    gap: 16px;

  .container {
    width: 100%;
    height: auto;
  }

  .title {
    font-family: initial;
    font-weight: 600;
    font-size: 26px;
    line-height: 1.35;
    margin: 8px 0px;
  }

  .flex-container {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .box-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .container-alert {
    margin-top: 32px;
    width: fit-content;
  }

  .edit-icon {
    font-size: 18px;
  }

  .verification-request-list ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
    background: ${colors.neutralTertiary};
  }

  .verification-request-list ::-webkit-scrollbar-thumb {
    background: ${colors.blackTertiary};
    border-radius: 4px;
  }

  .verification-request-list ::-moz-scrollbar {
    height: 4px;
    width: 4px;
    background: ${colors.neutralTertiary};
  }

  .verification-request-list ::-mz-scrollbar {
    height: 4px;
    width: 4px;
    background: ${colors.neutralTertiary};
  }
`;

export default VerificationRequestDisplayStyle;

import styled from "styled-components";
import Grid from "@mui/material/Grid";
import { queries } from "../../styles/mediaQueries";
import colors from "../../styles/colors";

const VerificationRequestGrid = styled(Grid)`
  display: flex;
  justify-content: center;
  width: 100%;

  .verificationRequestHeader {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 34px;
    gap: 16px;
  }

  .headerTitle {
    font-weight: bold;
    max-width: 900px;
    font-size: 40px;
  }

  .headerDescription {
    padding: 0px;
    text-align: center;
  }

  .filtersContainer {
    width: 100%;
    margin-top: 34px;
    border-top: 2px solid ${colors.neutralTertiary};
    border-bottom: 2px solid ${colors.neutralTertiary};
    background-color: ${colors.lightNeutralSecondary};
    justify-items: center;
  }

  .filterActions {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 16px;
  }

  .filterToggleContainer {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .filterBarContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  @media ${queries.xxl} {
    .filterActions {
      justify-content: center;
    }
  }

  @media ${queries.md} {
    .filterBarContainer {
      flex-wrap: wrap;
    }

    .filterActions {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
  }
`;

export default VerificationRequestGrid;

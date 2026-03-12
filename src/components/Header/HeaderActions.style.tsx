import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Grid } from "@mui/material";

const HeaderGridStyle = styled(Grid)`
  display: flex;
  align-items: center;
  padding: 0 15px;
  justify-content: space-evenly;
  height: 100%;

  .headerLogo {
    display: flex;
    align-items: center;
  }

  .headerActions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
  }

  @media ${queries.xs} {
    justify-content: space-between;

    .headerLogo {
      width: 62px;
    }

    .headerActions {
      gap: 12px;
    }
  }
`;

export default HeaderGridStyle;

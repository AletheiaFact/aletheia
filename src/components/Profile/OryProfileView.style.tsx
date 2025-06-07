import { Grid } from "@mui/material";
import styled from "styled-components";

const OryProfileGrid = styled(Grid)`
    justify-content: center;
    align-items: stretch;

    .title{
      font-size: 24px;
      font-weight: 600;
      font-family: initial;
      margin-bottom: 12px;
    }

    .subtitle{
      font-size: 20px;
      font-weight: 600;
      font-family: initial;
      margin: 24px 0px 10px;
    }
`;

export default OryProfileGrid;

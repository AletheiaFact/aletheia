import { Grid } from "@mui/material";
import styled from "styled-components";
import colors from "../../../styles/colors";

const ClaimCreateStyle = styled(Grid)`
justify-content: center;

.root-label{
  display: flex;
  gap: 5px;
}
.require-label{
  font-size: 14px;
  color: ${colors.error};
  margin: 0;
}
.form-label{
  font-size: 14px;
  color: ${colors.black};
  margin: 0;
}

.extra-label{
  font-size: 14px;
  color: ${colors.neutralSecondary};
  margin: 4px 0 0;
}
.extra-label:empty{
  display: none;
}
    
`;

export default ClaimCreateStyle;

import { Grid } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";

const ClaimSummary = styled(Grid)`
    position: relative;
    background: ${colors.lightNeutralSecondary};
    display: flex;
    padding: 12px 0px 0px 16px;
    margin: 1em auto;
    border-radius: 10px;

    &:after {
        content: " ";
        position: absolute;
        left: 10px;
        top: -12px;
        border-top: none;
        border-right: 12px solid transparent;
        border-left: 12px solid transparent;
        border-bottom: 12px solid ${colors.lightNeutralSecondary};
    }

    &.claim-review {
        background: ${colors.warning};
        &:after {
            border-bottom-color: ${colors.warning};
        }
    }
`;

export default ClaimSummary;

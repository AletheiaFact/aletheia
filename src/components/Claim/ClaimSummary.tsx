import { Row } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";

const ClaimSummary = styled(Row)`
    position: relative;
    background: ${colors.lightGraySecondary};
    display:flex;
    padding: 12px 0px 0px 16px;
    margin: 1em auto;
    border-radius:10px;

    &:after {
        content: " ";
        position: absolute;
        left: 10px;
        top: -12px;
        border-top: none;
        border-right: 12px solid transparent;
        border-left: 12px solid transparent;
        border-bottom: 12px solid ${colors.lightGraySecondary};
    }

    &.claim-review {
        background: ${colors.lightYellow};
        &:after {
            border-bottom-color: ${colors.lightYellow};
        }
    }
`;

export default ClaimSummary;

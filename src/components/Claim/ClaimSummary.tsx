import {Row} from "antd";
import styled from "styled-components";

const ClaimSummary = styled(Row)`
    position: relative;
    background: #EEEEEE;
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
        border-bottom: 12px solid #EEEEEE;
    }

    &.claim-review {
        background: rgba(219, 159, 13, 0.3);
        &:after {
            border-bottom-color: rgba(219, 159, 13, 0.3);
        }
    }
`;

export default ClaimSummary;

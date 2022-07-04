import {Row} from "antd";
import styled from "styled-components";

const SentenceReportSummary = styled(Row)`
    position: relative;
    background: #EEEEEE;
    display:flex;
    padding: 20px 20px 20px 20px;
    border-radius:10px;
    background-color: rgba(219, 159, 13, 0.3);

    &:after {
        content: " ";
        position: absolute;
        left: -31px;
        top: 20px;
        border-top: none;
        border-right: 20px solid transparent;
        border-left: 20px solid transparent;
        border-bottom: 22px solid #EEEEEE;
        transform: rotate(-90deg);
        border-bottom-color: rgba(219, 159, 13, 0.3);
    }
`;

export default SentenceReportSummary;

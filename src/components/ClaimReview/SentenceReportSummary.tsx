import { Row } from "antd";
import colors from "../../styles/colors";
import styled from "styled-components";

const SentenceReportSummary = styled(Row)`
    position: relative;
    background: ${colors.lightGray};
    display: flex;
    padding: 16px 24px;
    border-radius: 10px;
    background-color: ${colors.lightYellow};

    &:after {
        content: " ";
        position: absolute;
        left: -31px;
        top: 20px;
        border-top: none;
        border-right: 20px solid transparent;
        border-left: 20px solid transparent;
        border-bottom: 22px solid ${colors.lightGray};
        transform: rotate(-90deg);
        border-bottom-color: ${colors.lightYellow};
    }

    @media (max-width: 767px) {
        &:after {
            display: none;
        }
    }
`;

export default SentenceReportSummary;

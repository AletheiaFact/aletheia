import { Row } from "antd";
import colors from "../../styles/colors";
import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const SentenceReportSummary = styled(Row)`
    position: relative;
    margin: 8px 0 16px 4px;
    padding: 16px 24px;
    border-radius: 10px;
    background-color: ${colors.lightYellow};

    // small triangle pointing to the avatar on the side
    &:after {
        content: " ";
        position: absolute;
        left: -12px;
        top: 24px;
        border-top: none;
        border-right: 9px solid transparent;
        border-left: 9px solid transparent;
        border-bottom: 9px solid ${colors.lightYellow};
        transform: rotate(-90deg);
    }

    .sentence-content {
        font-size: 16px;
        color: ${colors.blackSecondary};
        margin-bottom: 0px;

        cite {
            font-style: normal;
        }

        a {
            color: ${colors.bluePrimary};
            font-weight: 700;
            margin-left: 10px;
        }
    }

    @media ${queries.sm} {
        margin-left: 0;

        // triangle pointing up
        &:after {
            left: 50px;
            top: -8px;
            transform: rotate(0deg);
        }
    }
`;

export default SentenceReportSummary;

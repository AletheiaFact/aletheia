import { Row } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";

const BannerStyle = styled(Row)`
    justify-content: center;
    padding: 100px 20px 20px;
    background-color: ${colors.graySecondary};

    .text {
        color: ${colors.blackPrimary};
        font-style: italic;
        font-size: 18px;
        line-height: 22px;
        text-align: center;
    }

    .cta-registration-button {
        white-space: pre-wrap;
        margin-top: 20px;

        span {
            padding: 24px 0 20px 0;
            font-size: 18px;
            line-height: 22px;
            text-align: center;
            font-weight: 900;
        }
    }
`;

export default BannerStyle;

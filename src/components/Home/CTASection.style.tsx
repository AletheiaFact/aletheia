import { Row } from "antd";
import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const CtaSectionStyle = styled(Row)`
    display: grid;
    grid-template-rows: 52px 72px;
    width: 100%;
    margin-top: 24px;

    .CTA-title {
        font-size: 16px;
    }

    @media ${queries.md} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        .CTA-button-container {
            margin-top: 12px;
        }
    }

    @media ${queries.xs} {
        .CTA-button-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 32px;
        }

        .CTA-title {
            font-size: 12px;
            font-weight: 700;
            width: 60%;
        }
    }
`;

export default CtaSectionStyle;

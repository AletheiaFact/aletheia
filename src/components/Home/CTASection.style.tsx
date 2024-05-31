import { Row } from "antd";
import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const CtaSectionStyle = styled(Row)`
    display: grid;
    grid-template-rows: 52px auto;
    width: 100%;
    margin-top: 24px;
    row-gap: 24px;

    .CTA-title {
        font-size: 16px;
    }

    .CTA-button-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        max-width: 385px;
    }

    @media ${queries.md} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .CTA-button-container {
            width: 100%;
        }
    }

    @media ${queries.xs} {
        .CTA-button-container {
            display: flex;
            justify-content: flex-end;
        }

        .CTA-title {
            font-size: 12px;
            font-weight: 700;
            width: 80%;
        }
    }
`;

export default CtaSectionStyle;

import { Col } from "antd";
import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";

const HomeHeaderSearchStyled = styled(Col)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 32px;
    gap: 32px;
    width: 100%;
    align-items: center;

    .title {
        color: ${colors.white};
        text-align: center;
        margin: 0;
        font-size: 24px;
    }

    @media ${queries.xs} {
        margin-top: 0;

        .title {
            font-size: 20px;
        }
    }
`;

export default HomeHeaderSearchStyled;

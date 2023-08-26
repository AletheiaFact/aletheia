import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Col } from "antd";

const HeaderActionsStyle = styled(Col)`
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;

    @media ${queries.sm} {
        padding: 0 1vw;

        button {
            padding: 0 1vw;
        }
    }
`;

export default HeaderActionsStyle;

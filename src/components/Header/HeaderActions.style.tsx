import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Col } from "antd";

const HeaderActionsStyle = styled(Col)`
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    align-items: center;
    gap: 16px;

    @media ${queries.xs} {
        justify-content: flex-end;
    }
`;

export default HeaderActionsStyle;

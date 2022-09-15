import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const HeaderActionsStyle = styled.div`
    display: flex;
    align-items: flex-end;
    padding: 0 15px;

    @media ${queries.sm} {
        padding: 0 1vw;

        button {
            padding: 0 1vw;
        }
    }
`;

export default HeaderActionsStyle;

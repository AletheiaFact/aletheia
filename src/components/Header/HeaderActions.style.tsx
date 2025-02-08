import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Grid } from "@mui/material";

const HeaderActionsStyle = styled(Grid)`
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

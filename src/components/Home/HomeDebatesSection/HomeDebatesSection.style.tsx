import styled from "styled-components";
import Grid from "@mui/material/Grid";
import colors from "../../../styles/colors";
import { queries } from "../../../styles/mediaQueries";

const HomeDebatesSectionStyle = styled(Grid)`
    width: 100%;
    background: ${colors.white};
    padding: 64px 0;
    display: flex;
    justify-content: center;

    .debates-inner {
        width: 100%;
        max-width: min(95vw, 1580px);
    }

    @media ${queries.md} {
        padding: 48px 0;
    }

    @media ${queries.sm} {
        padding: 40px 0;
    }
`;

export default HomeDebatesSectionStyle;

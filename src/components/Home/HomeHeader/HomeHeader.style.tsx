import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";
import Grid from "@mui/material/Grid";

const HomeHeaderStyle = styled(Grid)`
    display: flex;
    background-color: ${colors.blackTertiary};
    align-items: center;
    padding: 64px 0;
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;

    .home-header-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: start;
    }

    .home-header-title > h1 {
        font-size: clamp(24px, 3vw, 40px);
        color: ${colors.white};
        margin: 0;
    }

    .home-header-title > h2 {
        font-size: clamp(16px, 3vw, 40px);
        flex-direction: column;
    }

    @media (min-width: 768px) and (max-width: 822px) {
        .home-header-title > h1 {
            font-size: clamp(24px, 3vw, 40px);
        }
    }

    @media ${queries.sm} {
        padding: 32px 0;
        flex-direction: column;
        align-items: center;

        .home-header-title > h2 {
            flex-direction: row;
        }
    }

    @media ${queries.xs} {
        padding: 32px 5%;
    }
`;

export default HomeHeaderStyle;

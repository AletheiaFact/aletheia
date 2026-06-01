import styled from "styled-components";
import Grid from "@mui/material/Grid";
import colors from "../styles/colors";
import { queries } from "../styles/mediaQueries";

type GridListStyleProps = {
    $hasSubtitle?: boolean;
};

const GridListStyle = styled(Grid)<GridListStyleProps>`
    display: flex;
    flex-direction: column;
    gap: ${({ $hasSubtitle }) => ($hasSubtitle ? "40px" : "14px")};
    width: 100%;

    .grid-list-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        gap: 16px;
        flex-wrap: wrap;
    }

    .grid-list-header-text {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
    }

    .grid-list-title {
        font-family: inherit;
        font-size: clamp(28px, 2.8vw, 38px);
        font-weight: 700;
        line-height: 1.2;
        color: ${colors.primary};
        margin: 0;
    }

    .grid-list-subtitle {
        font-size: 15px;
        line-height: 1.45;
        color: ${colors.blackSecondary};
        margin: 0;
    }

    .grid-list-top-action {
        flex-shrink: 0;
    }

    .grid-list-bottom-action {
        display: flex;
        width: 100%;
        justify-content: center;
        margin: 8px 0 0 0;
    }

    @media ${queries.md} {
        gap: 24px;
    }
`;

export default GridListStyle;

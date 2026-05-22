import styled from "styled-components";
import Grid from "@mui/material/Grid";
import colors from "../../../styles/colors";
import { queries } from "../../../styles/mediaQueries";

const HomeReviewsSectionStyle = styled(Grid)`
    width: 100%;
    background: ${colors.lightTertiary};
    padding: 64px 0;
    display: flex;
    justify-content: center;

    .reviews-inner {
        max-width: min(95vw, 1580px);
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .reviews-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        flex-wrap: wrap;
    }

    .reviews-header-text {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
    }

    .reviews-header-title h2 {
        font-family: inherit;
        font-size: clamp(28px, 2.8vw, 38px);
        font-weight: 700;
        line-height: 1.2;
        color: ${colors.primary};
        margin: 0;
    }

    .reviews-header-subtitle {
        font-size: 15px;
        line-height: 1.45;
        color: ${colors.blackSecondary};
        margin: 0;
    }

    .reviews-see-all {
        flex-shrink: 0;
    }

    .reviews-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        width: 100%;
    }

    @media ${queries.lg} {
        .reviews-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media ${queries.md} {
        padding: 48px 0;

        .reviews-inner {
            gap: 18px;
        }

        .reviews-grid {
            grid-template-columns: 1fr;
        }
    }

    @media ${queries.sm} {
        padding: 40px 0;
    }
`;

export default HomeReviewsSectionStyle;

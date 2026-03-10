import styled from "styled-components";
import { Box } from "@mui/material";
import colors from "../../../styles/colors";
import { queries } from "../../../styles/mediaQueries";

const EventBox = styled(Box)`
    min-height: 100vh;

    .eventMainContent {
        display: flex;
        background: linear-gradient(180deg, ${colors.blackTertiary} 0%, ${colors.primary} 100%);
        align-items: center;
        padding: 68px 0 72px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .eventHeaderContent {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: flex-start;
        gap: 18px;
        padding: 0 24px;
    }

    .title {
        font-size: clamp(24px, 2.2vw, 52px);
        font-weight: 700;
        line-height: 1.15;
        margin: 0;
        color: ${colors.white};
    }

    .description {
        max-width: 1060px;
        font-size: clamp(14px, 1vw, 28px);
        line-height: 1.55;
        color: ${colors.quartiary};
        margin: 0;
    }

    @media ${queries.sm} {
        .eventMainContent {
            padding: 44px 0 50px;
        }

        .eventHeaderContent {
            padding: 0 20px;
        }
    }
`;

export default EventBox;

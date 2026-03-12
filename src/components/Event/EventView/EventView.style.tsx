import styled from "styled-components";
import { Box } from "@mui/material";
import colors from "../../../styles/colors";
import { queries } from "../../../styles/mediaQueries";

const EventBox = styled(Box)`
    min-height: 100vh;

    .eventContainerBase {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        padding: 56px 0 72px;
    }

    .mainContent{
        background: linear-gradient(180deg, ${colors.blackTertiary} 0%, ${colors.primary} 100%);
    }

    .eventSection {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: flex-start;
        padding: 0 24px;
    }

    .eventSectionHeader{
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .eventChipText{
        font-size: 14px;
        color: ${colors.white};
        font-weight: 700;
        padding: 8px 4px;
    }

    .eventLocationText {
        color: ${colors.quartiary};
        margin-top: 4px;
    }
    
    .eventChip {
        background-color: ${colors.lightSecondary};
        box-shadow: 0px 2px 4px ${colors.lightPrimary}; 
    }

    .eventChip:hover {
      box-shadow: 0px 3px 8px ${colors.lightPrimary};
    }

    .title {
        font-size: clamp(24px, 2.2vw, 52px);
        font-weight: 700;
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

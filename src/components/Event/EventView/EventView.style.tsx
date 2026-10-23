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

    .mainContent {
        background-image: linear-gradient(
            135deg,
            ${colors.primary} 0%,
            #002c4d 100%
        );
        position: relative;
    }

    .eventSection {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: flex-start;
    }

    .eventTopBar {
        display: flex;
        justify-content: space-between;
        align-content: center;
        width: 100%;
    }

    .edit-icon {
        color: ${colors.white};
        border-radius: 100%;
        padding: clamp(6px, 1vw, 10px);
        font-size: clamp(1.8rem, 2.5vw, 2.2rem);
        background-color: transparent;
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;
    }

    .edit-icon:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .eventSectionInfo {
        padding: clamp(20px, 2.5vw, 32px) clamp(16px, 2vw, 24px);
        gap: 10px;
        position: relative;
        background-color: ${colors.whiteLow};
        border: 1px solid ${colors.whiteLow};
        border-radius: 20px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 10px 30px -10px ${colors.shadow};
        overflow: hidden;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }

    .eventSectionInfo:hover {
        background-color: color-mix(
            in srgb,
            ${colors.whiteLow},
            transparent 30%
        );
        transform: translateY(-2px);
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    }

    .eventSectionHeader {
        display: flex;
        align-items: center;
        gap: clamp(8px, 1.5vw, 12px);
    }

    .bottomGradient {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;

        background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0) 60%,
            rgba(255, 255, 255, 0.5) 85%,
            ${colors.white} 100%
        );
        pointer-events: none;
        z-index: 1;
    }

    .eventChipText {
        font-size: clamp(12px, 1vw, 14px);
        color: ${colors.white};
        font-weight: 700;
        padding: 8px 4px;
    }

    .eventLocationText {
        color: ${colors.quartiary};
        margin-top: 4px;
        font-size: clamp(12px, 0.9vw, 16px);
    }

    .eventChip {
        background-color: ${colors.lightSecondary};
        box-shadow: 0px 2px 4px ${colors.lightPrimary};
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

    .eventParticipants {
        width: 100%;
        margin-top: 8px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .eventParticipantsHeader {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .eventParticipantsTitle {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${colors.tertiary};
    }

    .eventParticipantsCount {
        font-size: 13px;
        color: ${colors.tertiary};
    }

    .eventParticipantsList {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .eventParticipantTile {
        width: 152px;
        height: 72px;
        box-sizing: border-box;
        padding: 6px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: ${colors.whiteLow};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease, background-color 0.15s ease,
            border-color 0.15s ease;

        img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }
    }

    .eventParticipantTile:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
    }

    a.eventParticipantTile:hover {
        transform: translateY(-2px);
    }

    .eventParticipantTile:focus-visible {
        outline: 3px solid ${colors.lightSecondary};
        outline-offset: 2px;
    }

    .eventParticipantsToggle {
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: ${colors.whiteLow};
        color: ${colors.white};
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }

    @media ${queries.sm} {
        .eventSection {
            gap: clamp(8px, 2vw, 12px);
        }

        .eventParticipantsList {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
        }

        .eventParticipantTile {
            width: 100%;
            height: 56px;
            padding: 4px;
        }
    }
`;

export default EventBox;

import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";
import Grid from "@mui/material/Grid";

const HomeHeroStyle = styled(Grid)`
    position: relative;
    display: flex;
    background-color: ${colors.primary};
    background-image:
        radial-gradient(
            ellipse 60% 45% at 50% 0%,
            color-mix(in srgb, ${colors.lightSecondary} 14%, transparent) 0%,
            color-mix(in srgb, ${colors.lightSecondary} 0%, transparent) 70%
        ),
        radial-gradient(
            ellipse 60% 45% at 50% 100%,
            color-mix(in srgb, ${colors.lightSecondary} 10%, transparent) 0%,
            color-mix(in srgb, ${colors.lightSecondary} 0%, transparent) 70%
        ),
        linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size:
        100% 100%,
        100% 100%,
        56px 56px,
        56px 56px;
    background-position:
        center top,
        center bottom,
        center center,
        center center;
    background-repeat:
        no-repeat,
        no-repeat,
        repeat,
        repeat;
    align-items: center;
    padding: 96px 24px;
    flex-wrap: wrap;
    justify-content: center;
    overflow: hidden;

    .home-header-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 32px;
        margin: 0 auto;
    }

    .home-header-title {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        width: 100%;
    }

    .home-header-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border-radius: 999px;
        border: 1px solid ${colors.secondary};
        background-color: rgba(255, 255, 255, 0.04);
        color: ${colors.white};
        font-size: 14px;
        line-height: 1.2;
        backdrop-filter: blur(4px);
        white-space: nowrap;
        flex-shrink: 0;
    }

    .home-header-badge-text {
        white-space: nowrap;
    }

    .home-header-badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${colors.lightSecondary};
        box-shadow: 0 0 8px ${colors.lightSecondary};
    }

    .home-header-badge-text {
        font-weight: 400;
    }

    .home-header-title h1 {
        font-size: clamp(32px, 3.6vw, 52px);
        line-height: 1.15;
        font-weight: 700;
        color: ${colors.white};
        margin: 0;
        max-width: 1100px;
        font-family: inherit;
        overflow-wrap: break-word;
    }

    .home-header-title-line {
        display: block;
    }

    .home-header-title-highlight {
        color: ${colors.lightSecondary};
        background-image: linear-gradient(
            to right,
            color-mix(in srgb, ${colors.secondary} 0%, transparent) 0%,
            ${colors.secondary} 18%,
            ${colors.secondary} 82%,
            color-mix(in srgb, ${colors.secondary} 0%, transparent) 100%
        );
        background-repeat: no-repeat;
        background-size: 100% 2px;
        background-position: 0 100%;
        padding-bottom: 8px;
    }

    .home-header-description {
        font-size: clamp(14px, 1.4vw, 18px);
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.75);
        margin: 0;
        max-width: 680px;
    }

    .home-header-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 16px;
        width: 100%;
    }

    .home-header-action-button {
        height: 48px !important;
        padding: 0 24px !important;
        border-radius: 8px !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        text-transform: none !important;
        gap: 8px;
    }

    .home-header-action-primary {
        background-color: ${colors.lightSecondary} !important;
        border-color: ${colors.lightSecondary} !important;
        color: ${colors.primary} !important;
    }

    .home-header-action-secondary {
        background-color: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        color: ${colors.white} !important;
    }

    .home-header-action-icon {
        font-size: 18px !important;
        margin-left: 4px;
    }

    .home-header-features {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 48px;
        width: 100%;
        padding-top: 32px;
        margin-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .home-header-feature {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 15px;
    }

    .home-header-feature-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: ${colors.lightSecondary};

        svg {
            font-size: 20px;
        }
    }

    @media ${queries.md} {
        padding: 72px 24px;

        .home-header-features {
            gap: 24px;
        }
    }

    @media ${queries.sm} {
        padding: 56px 20px;

        .home-header-content {
            gap: 24px;
            width: 100%;
        }

        .home-header-title h1 {
            font-size: clamp(26px, 7.5vw, 36px);
        }

        .home-header-title-line {
            display: inline;
        }

        .home-header-actions {
            flex-direction: column;
            width: 100%;
            gap: 12px;
        }

        .home-header-action-button {
            width: 100%;
        }

        .home-header-features {
            gap: 16px;
            flex-direction: column;
            align-items: flex-start;
            padding-left: 16px;
        }

        .home-header-feature {
            font-size: 14px;
        }
    }

    @media ${queries.xs} {
        padding: 48px 16px;

        .home-header-badge {
            font-size: 12px;
            padding: 5px 12px;
        }

        .home-header-title h1 {
            font-size: clamp(24px, 8vw, 32px);
        }

        .home-header-features {
            padding-left: 8px;
        }
    }
`;

export default HomeHeroStyle;

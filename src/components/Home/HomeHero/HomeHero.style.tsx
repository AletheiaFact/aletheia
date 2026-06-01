import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";
import Grid from "@mui/material/Grid";

const HomeHeroStyle = styled(Grid)`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;

    .home-header-dark-section {
        position: relative;
        display: flex;
        background-color: ${colors.primary};
        background-image: radial-gradient(
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
            linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.04) 1px,
                transparent 1px
            );
        background-size: 100% 100%, 100% 100%, 56px 56px, 56px 56px;
        background-position: center top, center bottom, center center,
            center center;
        background-repeat: no-repeat, no-repeat, repeat, repeat;
        align-items: center;
        padding: clamp(48px, 8vw, 96px) clamp(16px, 3vw, 24px);
        flex-wrap: wrap;
        justify-content: center;
    }

    .home-header-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: clamp(24px, 3.5vw, 32px);
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
        padding: clamp(5px, 0.8vw, 6px) clamp(12px, 2vw, 16px);
        border-radius: 999px;
        border: 1px solid ${colors.secondary};
        background-color: rgba(255, 255, 255, 0.04);
        color: ${colors.white};
        font-size: clamp(12px, 1.4vw, 14px);
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
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 16px;
        width: 100%;
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
        gap: clamp(16px, 3vw, 48px);
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
        font-size: clamp(14px, 1.5vw, 15px);
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

    .home-header-stats-section {
        background-color: ${colors.white};
        border-top: 1px solid ${colors.lightNeutralSecondary};
        padding: clamp(24px, 4vw, 48px) clamp(8px, 2vw, 24px);
        width: 100%;
    }

    .home-header-stats {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .home-header-stats-item {
        flex: 1;
        min-width: 0;
        text-align: center;
    }

    .home-header-stats-value {
        font-size: clamp(22px, 6vw, 72px);
        font-weight: 700;
        line-height: 1;
        color: ${colors.lightPrimary};
        letter-spacing: -0.02em;
    }

    .home-header-stats-label {
        font-size: clamp(10px, 1.2vw, 14px);
        font-weight: 500;
        line-height: 1.2;
        color: ${colors.secondary};
        text-transform: uppercase;
        letter-spacing: clamp(0.08em, 0.3vw, 0.18em);
    }

    .home-header-stats-divider {
        align-self: stretch;
        width: 1px;
        background-color: ${colors.lightNeutralSecondary};
        margin: 0 clamp(4px, 1.5vw, 24px);
    }

    @media ${queries.sm} {
        .home-header-content {
            width: 100%;
        }

        .home-header-title h1 {
            font-size: clamp(26px, 7.5vw, 36px);
        }

        .home-header-title-line {
            display: inline;
        }

        .home-header-actions a {
            width: 100%;
        }

        .home-header-features {
            flex-direction: column;
            align-items: flex-start;
            padding-left: 16px;
        }
    }

    @media ${queries.xs} {
        .home-header-title h1 {
            font-size: clamp(24px, 8vw, 32px);
        }

        .home-header-features {
            padding-left: 8px;
        }

        .home-header-title-highlight {
            padding-bottom: 0px;
        }
    }
`;

export default HomeHeroStyle;

import styled from "styled-components";
import Grid from "@mui/material/Grid";
import colors from "../../../styles/colors";
import { queries } from "../../../styles/mediaQueries";

const HomeJoinSectionStyle = styled(Grid)`
    width: 100%;
    display: flex;
    flex-direction: column;

    .home-join-band {
        width: 100%;
        background: linear-gradient(
            180deg,
            ${colors.lightTertiary} 0%,
            color-mix(in srgb, ${colors.lightTertiary} 55%, ${colors.white})
                100%
        );
        padding: clamp(48px, 7vw, 96px) clamp(16px, 4vw, 64px);
        display: flex;
        justify-content: center;
    }

    .home-join-inner {
        width: 100%;
        max-width: min(95vw, 1580px);
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: clamp(24px, 4vw, 64px);
        align-items: center;
    }

    .ctaMainColumn {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .home-join-badge {
        display: inline-flex;
        align-self: flex-start;
        padding: 6px 14px;
        border-radius: 6px;
        background-color: ${colors.inactive};
        color: ${colors.primary};
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        white-space: nowrap;
    }

    .ctaTitle {
        font-size: clamp(32px, 4vw, 52px);
        line-height: 1.1;
        font-weight: 800;
        color: ${colors.primary};
        margin: 0;
        font-family: inherit;
    }

    .ctaBody {
        font-size: clamp(15px, 1.4vw, 18px);
        line-height: 1.6;
        color: ${colors.secondary};
        margin: 0;
        max-width: 540px;
    }

    .ctaButtonWrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 8px;
    }

    .ctaAchievementsColumn {
        background-color: ${colors.white};
        border-radius: 16px;
        padding: clamp(24px, 3vw, 40px);
        box-shadow: 0 12px 48px rgba(17, 39, 58, 0.08);
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .ctaAchievementsTitle {
        font-size: clamp(18px, 1.6vw, 20px);
        font-weight: 700;
        color: ${colors.primary};
        margin: 0;
        font-family: inherit;
    }

    .ctaAchievementsList {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 16px;
    }

    .ctaAchievementsItem {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        gap: 12px;
        align-items: center;
        padding: 0;
    }

    .ctaAchievementsIcon {
        color: ${colors.lightPrimary};
        font-size: 22px;
    }

    .ctaAchievementsText {
        font-size: clamp(14px, 1.3vw, 16px);
        line-height: 1.5;
        color: ${colors.blackSecondary};
        margin: 0;
    }

    .home-join-share-band {
        width: 100%;
        background-color: ${colors.lightNeutral};
        padding: clamp(40px, 5vw, 64px) clamp(16px, 3vw, 24px);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    .home-join-share-title {
        font-size: clamp(20px, 2vw, 26px);
        font-weight: 700;
        color: ${colors.primary};
        margin: 0;
        text-align: center;
        font-family: inherit;
    }

    .home-join-share-list {
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: center;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .home-join-share-list button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    @media ${queries.md} {
        .home-join-inner {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    @media ${queries.sm} {
        .home-join-actions {
            flex-direction: column;
            width: 100%;
        }

        .home-join-action-button {
            width: 100%;
        }
    }

    @media ${queries.xs} {
        .ctaButtonWrapper {
            flex-direction: column;
        }

        .ctaButtonWrapper a {
            width: 100%;
        }
    }
`;

export default HomeJoinSectionStyle;

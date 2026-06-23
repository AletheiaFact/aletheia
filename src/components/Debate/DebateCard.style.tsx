import styled from "styled-components";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";

const DebateCardStyled = styled.div`
    width: 100%;

    .debate-card-header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 16px;
    }

    .debate-card-live-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px;
        border-radius: 999px;
        background-color: ${colors.error};
        color: ${colors.white};
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    @keyframes liveDotPulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
    }

    .debate-card-live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${colors.white};
        animation: liveDotPulse 1.5s ease-in-out infinite;
    }

    .debate-card-title {
        font-size: clamp(22px, 3vw, 30px);
        line-height: 1.15;
        margin: 0 0 32px 0;
        font-weight: 600;
        color: ${colors.neutral};
    }

    .debate-card-personalities {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: clamp(8px, 2vw, 24px);
    }

    .debate-card-personality {
        flex: 1;
        width: 100%;
        max-width: 320px;
    }

    .debate-card-vs {
        flex-shrink: 0;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: ${colors.primary};
        color: ${colors.white};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 18px;
        border: 4px solid ${colors.lightSecondary};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .debate-card-actions {
        display: flex;
        justify-content: center;
        margin-top: 32px;
    }

    @media ${queries.sm} {
        .debate-card-personalities {
            flex-direction: column;
            gap: 16px;
        }

        .debate-card-personality {
            max-width: 100%;
        }
    }
`;

export default DebateCardStyled;

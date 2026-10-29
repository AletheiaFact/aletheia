import styled from "styled-components";
import { Dialog } from "@mui/material";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";

const CatarseMeuCandidatoStyle = styled(Dialog)`
    .MuiDialog-paper {
        margin: 16px;
        max-width: 960px;
        width: 100%;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0px 20px 60px ${colors.shadow};
    }

    .catarse-modal {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        min-height: 460px;

        @media ${queries.md} {
            grid-template-columns: 1fr;
        }
    }

    .catarse-panel {
        padding: 40px;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .catarse-panel--dark {
        background-color: ${colors.primary};
        background-image: linear-gradient(${colors.whiteLow} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.whiteLow} 1px, transparent 1px);
        background-size: 28px 28px;
        justify-content: center;
        gap: 16px;
    }

    .catarse-panel--light {
        background-color: ${colors.white};
        justify-content: center;
        gap: 16px;
    }

    .catarse-eyebrow {
        color: ${colors.tertiary};
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
    }

    .catarse-headline {
        font-family: "Noticia Text", serif;
        color: ${colors.white};
        font-size: 30px;
        font-weight: 700;
        line-height: 1.25;
        margin: 8px 0 0;
    }

    .catarse-description {
        color: ${colors.whiteHigh};
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
    }

    .catarse-quote {
        border-left: 3px solid ${colors.lightSecondary};
        padding-left: 16px;
        margin: 4px 0 0;
        font-style: italic;
        color: ${colors.lightTertiary};
        font-size: 15px;
    }

    .catarse-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 8px;
    }

    .catarse-badge {
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 999px;
        padding: 6px 16px;
        font-size: 13px;
        color: ${colors.white};
    }

    .catarse-close {
        position: absolute;
        top: 16px;
        right: 16px;
        color: ${colors.secondary};
    }

    .catarse-panel-title {
        color: ${colors.primary};
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 8px;
        padding-bottom: 16px;
        border-bottom: 1px solid ${colors.lightNeutralSecondary};
    }

    .catarse-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .catarse-list li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        color: ${colors.blackSecondary};
        font-size: 14px;
        line-height: 1.5;
    }

    .catarse-list li svg {
        color: ${colors.secondary};
        font-size: 20px;
        margin-top: 2px;
        flex-shrink: 0;
    }

    .catarse-list strong {
        color: ${colors.black};
    }

    .catarse-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background-color: ${colors.primary};
        color: ${colors.white};
        font-weight: 700;
        font-size: 15px;
        text-decoration: none;
        border-radius: 10px;
        padding: 14px 20px;
        margin-top: 12px;
        transition: background-color 0.2s ease;
    }

    .catarse-cta:hover {
        background-color: ${colors.primaryHover};
    }

    .catarse-dismiss {
        background: none;
        border: none;
        color: ${colors.secondary};
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        padding: 4px;
    }

    .catarse-dismiss:hover {
        text-decoration: underline;
    }

    @media ${queries.xs} {
        .catarse-panel {
            padding: 28px 24px;
        }

        .catarse-headline {
            font-size: 22px;
        }
    }
`;

export default CatarseMeuCandidatoStyle;

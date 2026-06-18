import { Box } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";

export const CommitteInvitationBoxStyle = styled(Box)`
    .container-section {
        max-width: min(95vw, 1580px);
        margin: 0 auto;
        padding: 0 clamp(16px, 3vw, 32px);
    }

    /* ─── Shared section tokens ─── */
    .section-eyebrow {
        color: ${colors.lightPrimary};
        letter-spacing: 2px;
        font-size: clamp(12px, 1.4vw, 14px);
        font-weight: 600;
        margin-bottom: 16px;
    }

    .section-title {
        margin: 0 0 clamp(16px, 2.5vw, 24px);
        font-weight: 700;
        font-size: clamp(1.5rem, 3.5vw, 2.25rem);
        text-align: center;
    }

    .section-description {
        text-align: center;
        color: ${colors.secondary};
        line-height: 1.7;
    }

    /* ─── Shared icon wrapper ─── */
    .benefit-icon-wrapper {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background-color: ${colors.lightNeutral};
        color: ${colors.lightPrimary};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    /* ─── Hero ─── */
    .hero-wrapper {
        background: linear-gradient(
            to right,
            ${colors.lightNeutral},
            color-mix(in srgb, ${colors.lightQuartiary} 70%, transparent) 100%
        );
        padding: clamp(48px, 8vw, 80px) clamp(16px, 3.5vw, 32px)
            clamp(32px, 5vw, 48px);
    }

    .hero-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: clamp(10px, 2vw, 14px) clamp(12px, 2vw, 16px);
        border-radius: 999px;
        background-color: ${colors.lightQuartiary};
        color: ${colors.lightPrimary};
        font-size: clamp(12px, 1.4vw, 14px);
        backdrop-filter: blur(4px);
    }

    .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${colors.active};
        box-shadow: 0 0 8px ${colors.lightSecondary};
    }

    .hero-title {
        color: ${colors.primary};
        font-size: clamp(2.2rem, 4.5vw, 3.4rem);
        font-weight: 700;
        line-height: 1.15;
        margin-bottom: clamp(16px, 2.5vw, 24px);
    }

    .hero-description {
        color: ${colors.secondary};
        line-height: 1.7;
        max-width: 480px;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .stat-value {
        font-weight: 700;
    }

    .stat-label {
        color: ${colors.secondary};
    }

    /* ─── Quote Card ─── */
    .quote-card {
        position: relative;
        background-color: ${colors.white};
        border-radius: 16px;
        padding: clamp(20px, 3vw, 32px);
        border: 1px solid ${colors.neutralTertiary};
        z-index: 0;
        overflow: visible;
        transform-style: preserve-3d;
        justify-self: center;
        max-width: 680px;

        &::before {
            content: "";
            position: absolute;
            bottom: -16px;
            left: -16px;
            width: 110px;
            height: 110px;
            border-radius: 50%;
            background-color: ${colors.tertiary};
            opacity: 0.22;
            z-index: -1;
            pointer-events: none;
            transform: translateZ(-1px);
        }

        &::after {
            content: "";
            position: absolute;
            top: -18px;
            right: -18px;
            width: 90px;
            height: 90px;
            border-radius: 20px;
            background-color: ${colors.tertiary};
            opacity: 0.15;
            z-index: -1;
            pointer-events: none;
            transform: translateZ(-1px);
        }
    }

    .quote-card .quote-decorator {
        color: ${colors.tertiary};
        display: flex;
        align-items: center;
    }

    .quote-text {
        color: ${colors.blackSecondary};
        line-height: 1.65;
        font-size: clamp(1rem, 2vw, 1.25rem);
        max-width: 600px;
    }

    .quote-avatar-label {
        color: ${colors.primary};
        font-weight: 700;
        font-size: 0.65rem;
    }

    .quote-author-name {
        font-weight: 600;
        color: ${colors.primary};
        line-height: 1.3;
    }

    .quote-author-source {
        color: ${colors.secondary};
    }

    /* ─── Our Mission ─── */
    .section-wrapper {
        background-color: ${colors.lightNeutral};
        padding: clamp(48px, 8vw, 80px) clamp(16px, 3.5vw, 32px);
    }

    .section-wrapper .section-description {
        max-width: 640px;
    }

    .mission-card {
        padding: clamp(16px, 2.5vw, 24px);
        border-radius: 18px;
        border: 1px solid ${colors.lightPrimary};
        background-color: ${colors.white};
        transition: box-shadow 0.2s ease;
        height: 100%;

        &:hover {
            box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        }
    }

    .card-item-title {
        font-weight: 600;
        margin-bottom: 0.35em;
    }

    .card-item-description {
        color: ${colors.secondary};
        line-height: 1.6;
    }

    .dark-quote-block {
        position: relative;
        justify-self: center;
        background-color: ${colors.primary};
        border-radius: 8px;
        padding: clamp(32px, 4vw, 40px) clamp(24px, 5vw, 48px);
        margin-top: clamp(32px, 5vw, 48px);
        max-width: 820px;
    }

    .dark-quote-block .quote-decorator {
        position: absolute;
        top: 20px;
        left: 20px;
        color: ${colors.secondary};
        display: flex;
        justify-content: start;
        align-items: center;
    }

    .dark-quote-text {
        color: ${colors.white};
        font-style: italic;
        font-size: clamp(1rem, 1.8vw, 1.15rem);
        line-height: 1.7;
        max-width: 680px;
        text-align: center;
    }

    .dark-quote-author {
        color: rgba(255, 255, 255, 0.6);
    }

    /* ─── Benefits ─── */
    .benefits-wrapper {
        background-color: ${colors.lightTertiary};
        padding: clamp(48px, 8vw, 80px) clamp(16px, 3.5vw, 32px);
    }

    .benefits-wrapper .section-description {
        margin: 0;
        font-size: clamp(1rem, 1.8vw, 1.125rem);
        max-width: 750px;
    }

    .benefit-card {
        display: flex;
        padding: clamp(16px, 2.5vw, 24px);
        border-radius: 18px;
        border: 1px solid ${colors.lightPrimary};
        background-color: ${colors.white};
        transition: box-shadow 0.2s ease;

        &:hover {
            border: 1px solid transparent;
        }
    }

    .pact-box {
        background-color: color-mix(
            in srgb,
            ${colors.lightTertiary} 95%,
            ${colors.black}
        );
        border-radius: 18px;
        border: 1px solid ${colors.lightPrimary};
        padding: clamp(20px, 3vw, 32px) clamp(20px, 4vw, 40px);
        margin-top: clamp(32px, 5vw, 48px);
        max-width: 720px;
        justify-self: center;
        text-align: center;
    }

    .pact-title {
        font-weight: 700;
    }

    .pact-description {
        font-size: clamp(13px, 1.5vw, 15px);
        color: ${colors.secondary};
        line-height: 1.7;
    }

    /* ─── CTA ─── */
    .cta-wrapper {
        background-color: ${colors.lightQuartiary};
        padding: clamp(48px, 8vw, 80px) clamp(16px, 3.5vw, 32px);
    }

    .cta-title {
        margin: 0 0 clamp(16px, 2.5vw, 24px);
        font-weight: 700;
        font-size: clamp(1.5rem, 3.5vw, 2.25rem);
        text-align: center;
    }

    .cta-description {
        margin: 0;
        font-size: clamp(1rem, 1.8vw, 1.125rem);
        text-align: center;
        color: ${colors.secondary};
        max-width: 580px;
        line-height: 1.7;
    }

    .cta-card {
        background-color: ${colors.white};
        border-radius: 18px;
        max-width: 1400px;
        justify-self: center;
        border: 1px solid ${colors.lightPrimary};
        overflow: hidden;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
            0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        margin-top: clamp(24px, 4vw, 40px);
    }

    .cta-card-left {
        padding: clamp(20px, 3vw, 32px);
        border-right: 1px solid ${colors.lightNeutralSecondary};

        @media ${queries.md} {
            border-right: none;
            border-bottom: 1px solid ${colors.lightNeutralSecondary};
        }
    }

    .cta-who-can-join-title {
        font-weight: 700;
        margin-bottom: 0.35em;
    }

    .cta-icon-label {
        text-align: center;
        color: ${colors.secondary};
    }

    .checklist-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        padding: 6px 0;
    }

    .cta-checklist-icon {
        color: ${colors.active};
        font-size: 20px;
    }

    .cta-checklist-item-text {
        font-size: clamp(13px, 1.5vw, 15px);
        color: ${colors.secondary};
    }

    .cta-card-right {
        padding: clamp(20px, 3vw, 32px);
        background-color: ${colors.lightNeutral};
        height: 100%;
        align-content: center;
    }

    .cta-card-right .hero-chip {
        background-color: color-mix(
            in srgb,
            ${colors.active} 5%,
            ${colors.lightNeutral}
        );
        color: color-mix(in srgb, ${colors.active} 90%, ${colors.black});
    }

    .cta-form-title {
        font-weight: 700;
        margin-bottom: 0.35em;
    }

    .cta-form-description {
        color: ${colors.secondary};
        line-height: 1.7;
    }

    .cta-contact-text {
        text-align: center;
        color: ${colors.secondary};
    }

    .cta-contact-link {
        color: ${colors.secondary};
    }

    @media ${queries.xs} {
        .hero-chip {
            font-size: 12px;
            padding: 6px 6px;
            height: auto;
        }

        .hero-chip span {
            white-space: normal;
        }
    }
`;

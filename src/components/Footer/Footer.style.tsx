import { Box } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";

type FooterBoxProps = {
    $mediumDevice?: boolean;
    $isMobile?: boolean;
    $namespacePrefix: string;
};

const FooterBox = styled(Box) <FooterBoxProps>`
    background: radial-gradient(
            circle at 78% 14%,
            color-mix(in srgb, ${colors.lightSecondary} 14%, transparent) 0%,
            color-mix(in srgb, ${colors.lightSecondary} 2%, transparent) 34%,
            transparent 55%
        ),
        ${({ $namespacePrefix }) => ($namespacePrefix ? colors.primary : colors.secondary)};
    color: ${colors.white};
    padding: ${({ $isMobile }) => ($isMobile ? "36px 20px 18px" : "64px 48px 22px")};
    align-self: flex-end;
    border-top: 1px solid color-mix(in srgb, ${colors.white} 8%, transparent);

    .footer-inner-container {
        max-width: ${({ $mediumDevice }) => ($mediumDevice ? "100%" : "75%")};
        margin: 0 auto;
    }

    .footer-cta-card {
        border: 1px solid color-mix(in srgb, ${colors.white} 12%, transparent);
        border-radius: 16px;
        padding: ${({ $isMobile }) => ($isMobile ? "24px 18px" : "40px 38px")};
        background: linear-gradient(
            90deg,
            color-mix(in srgb, ${colors.lightSecondary} 10%, transparent) 0%,
            color-mix(in srgb, ${({ $namespacePrefix }) => ($namespacePrefix ? colors.primary : colors.secondary)} 2%, transparent) 56%,
            color-mix(in srgb, ${colors.lightSecondary} 10%, transparent) 100%
        );
    }

    .footer-cta-title {
        font-family: "Open Sans", sans-serif;
        font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "28px")};
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: -0.4px;
        margin-bottom: 14px;
    }

    .footer-cta-description {
        color: color-mix(in srgb, ${colors.white} 78%, transparent);
        font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
        line-height: 1.42;
        max-width: 900px;
    }

    .footer-cta-actions {
        justify-content: ${({ $isMobile }) => ($isMobile ? "flex-start" : "flex-end")};
        flex-direction: ${({ $isMobile }) => ($isMobile ? "column" : "row")};
        gap: 12px;
    }

    .footer-primary-cta-link {
        min-height: 44px;
        border-radius: 12px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        color: ${({ $namespacePrefix }) => ($namespacePrefix ? colors.primary : colors.secondary)};
        background-color: ${({ $namespacePrefix }) => ($namespacePrefix ? colors.lightSecondary : colors.white)};
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        &:hover {
            opacity: 0.92;
        }
    }

    .footer-secondary-cta-link {
        min-height: 44px;
        border-radius: 12px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        color: ${colors.white};
        border: 1px solid color-mix(in srgb, ${colors.white} 16%, transparent);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        gap: 8px;

        &:hover {
            background-color: color-mix(in srgb, ${colors.white} 6%, transparent);
        }
    }

    .footer-main-grid {
        margin-top: ${({ $isMobile }) => ($isMobile ? "26px" : "44px")};
        padding-bottom: ${({ $isMobile }) => ($isMobile ? "26px" : "42px")};
    }

    .footer-brand-title {
        font-family: "Open Sans", sans-serif;
        font-weight: 700;
        font-size: ${({ $isMobile }) => ($isMobile ? "22px" : "30px")};
        margin-bottom: 12px;
    }

    .footer-brand-description {
        color: color-mix(in srgb, ${colors.white} 65%, transparent);
        font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
    }

    .footer-social-stack {
        margin-top: 18px;
    }

    .footer-social-link {
        border: 1px solid color-mix(in srgb, ${colors.white} 16%, transparent);
        width: ${({ $isMobile }) => ($isMobile ? "38px" : "42px")};
        height: ${({ $isMobile }) => ($isMobile ? "38px" : "42px")};
        border-radius: 12px;
        display: grid;
        place-content: center;
        color: color-mix(in srgb, ${colors.white} 75%, transparent);

        &:hover {
            color: ${colors.white};
            border-color: color-mix(in srgb, ${colors.white} 34%, transparent);
        }
    }

    .footer-open-source-pill {
        margin-top: 20px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid color-mix(in srgb, ${colors.white} 16%, transparent);
        border-radius: 999px;
        padding: 10px 14px;
        color: color-mix(in srgb, ${colors.white} 72%, transparent);
        font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "12px")};
    }

    .footer-column-title {
        font-family: "Open Sans", sans-serif;
        font-weight: 700;
        letter-spacing: 0.06em;
        font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
        margin-bottom: 14px;
    }

    .footer-column-link {
        color: color-mix(in srgb, ${colors.white} 62%, transparent);
        font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
        line-height: 1.4;

        &:hover {
            color: ${colors.white};
        }
    }

    .footer-contact-text {
        color: color-mix(in srgb, ${colors.white} 62%, transparent);
        font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
        line-height: 1.4;
        line-break: anywhere;
    }

    .footer-statute-link {
        margin-top: 6px;
        color: ${colors.lightSecondary};
        font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .footer-statute-arrow {
        font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
    }

    .footer-legal-container {
        padding-top: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
        color: color-mix(in srgb, ${colors.white} 58%, transparent);
        flex-direction: ${({ $isMobile }) => ($isMobile ? "column" : "row")};
        gap: ${({ $isMobile }) => ($isMobile ? "9.6px" : "16px")};
        border-top: 1px solid color-mix(in srgb, ${colors.white} 10%, transparent);
    }

    .footer-legal-text {
        font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "12px")};
    }

    .footer-icon {
        font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
        color: ${colors.lightSecondary};
        margin-bottom: 2px;
    }
`;

export default FooterBox;

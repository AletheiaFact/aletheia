/**
 * BackButton Component
 * GitLab-style back button for page headers
 * 
 * Features:
 * - Button-like appearance with proper padding
 * - Hover states following GitLab design patterns
 * - Proper spacing and typography
 * - Icon and text alignment
 */

import { useTranslation } from "next-i18next";
import React, { CSSProperties } from "react";
import { ArrowBackOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import styled from "styled-components";
import { spacing, semanticColors, borderRadius, typography, layout } from "../styles";

interface BackButtonProps {
    style?: CSSProperties;
    callback?: () => void;
    isVisible?: boolean;
}

const BackButtonContainer = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${spacing.xs}; /* 4px gap between icon and text */
    padding: ${spacing.button} ${spacing.md}; /* 12px vertical, 16px horizontal */
    background: transparent;
    border: none;
    border-radius: ${borderRadius.sm};
    color: ${semanticColors.text.secondary};
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.sm}; /* 14px */
    font-weight: ${typography.fontWeight.normal};
    line-height: ${typography.lineHeight.none};
    cursor: pointer;
    transition: ${layout.transitions.default};
    text-decoration: none;
    outline: none;

    /* Icon styling */
    svg {
        font-size: 16px;
        width: 16px;
        height: 16px;
        transition: ${layout.transitions.transform};
    }

    /* Hover state - GitLab style subtle background */
    &:hover {
        background-color: ${semanticColors.surface.secondary};
        color: ${semanticColors.text.primary};
        
        svg {
            transform: translateX(-2px);
        }
    }

    /* Active state */
    &:active {
        background-color: ${semanticColors.surface.tertiary};
        transform: scale(0.98);
    }

    /* Focus state for accessibility */
    &:focus-visible {
        outline: 2px solid ${semanticColors.border.focus};
        outline-offset: 2px;
    }

    /* Disabled state */
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
            background-color: transparent;
            transform: none;
        }
    }
`;

function BackButton({
    style,
    callback,
    isVisible = true,
}: BackButtonProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = router?.pathname || "";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (callback) {
            callback();
        } else {
            // TODO: check if the previous page in history is from Aletheia
            // if it's not, go to home page
            router.back();
        }
    };

    if (pathname !== "/" && pathname !== "/home-page" && isVisible) {
        return (
            <BackButtonContainer
                data-cy="testBackButton"
                onClick={handleClick}
                style={style}
                type="button"
                aria-label={t("common:back_button")}
            >
                <ArrowBackOutlined fontSize="small" />
                <span>{t("common:back_button")}</span>
            </BackButtonContainer>
        );
    } else {
        return null;
    }
}

export default BackButton;

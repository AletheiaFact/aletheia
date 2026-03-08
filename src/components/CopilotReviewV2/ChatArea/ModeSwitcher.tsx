import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import { ReviewMode } from "../hooks/useModeSwitcher";

interface ModeSwitcherProps {
    mode: ReviewMode;
    onModeChange: (mode: ReviewMode) => void;
}

const ModeSwitcherStyled = styled.div`
    display: flex;
    background: ${colors.lightNeutralSecondary};
    border-radius: 8px;
    padding: 2px;
    gap: 2px;

    .mode-button {
        padding: 6px 16px;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        background: transparent;
        color: ${colors.secondary};

        &.active {
            background: ${colors.white};
            color: ${colors.primary};
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        &:hover:not(.active) {
            color: ${colors.primary};
        }
    }
`;

const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
    const { t } = useTranslation();

    return (
        <ModeSwitcherStyled>
            <button
                className={`mode-button ${mode === "chat" ? "active" : ""}`}
                onClick={() => onModeChange("chat")}
                data-cy="copilotV2ModeChat"
            >
                {t("copilotChatBot:chatMode")}
            </button>
            <button
                className={`mode-button ${mode === "form" ? "active" : ""}`}
                onClick={() => onModeChange("form")}
                data-cy="copilotV2ModeForm"
            >
                {t("copilotChatBot:formMode")}
            </button>
        </ModeSwitcherStyled>
    );
};

export default ModeSwitcher;

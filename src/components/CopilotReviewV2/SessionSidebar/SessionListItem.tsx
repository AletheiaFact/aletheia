import React from "react";
import styled from "styled-components";
import { CopilotSessionSummary } from "../hooks/useCopilotSessions";

interface SessionListItemProps {
    session: CopilotSessionSummary;
    isActive: boolean;
    onClick: (sessionId: string) => void;
}

const SessionListItemStyled = styled.div<{ $isActive: boolean }>`
    padding: 10px 12px;
    margin-bottom: 4px;
    border-radius: 8px;
    cursor: pointer;
    background: ${(props) =>
        props.$isActive ? "rgba(37, 99, 235, 0.2)" : "transparent"};
    transition: background 0.15s;

    &:hover {
        background: ${(props) =>
            props.$isActive
                ? "rgba(37, 99, 235, 0.25)"
                : "rgba(255, 255, 255, 0.05)"};
    }

    .session-title {
        font-size: 14px;
        font-weight: ${(props) => (props.$isActive ? 600 : 400)};
        color: ${(props) =>
            props.$isActive
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(255, 255, 255, 0.7)"};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .session-date {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 4px;
    }
`;

const SessionListItem = ({
    session,
    isActive,
    onClick,
}: SessionListItemProps) => {
    const title =
        session.title ||
        `Session ${new Date(session.createdAt).toLocaleDateString()}`;
    const date = new Date(session.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <SessionListItemStyled
            $isActive={isActive}
            onClick={() => onClick(session._id)}
            data-cy="copilotV2SessionItem"
        >
            <div className="session-title">{title}</div>
            <div className="session-date">{date}</div>
        </SessionListItemStyled>
    );
};

export default SessionListItem;

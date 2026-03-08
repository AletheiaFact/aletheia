import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import SessionSidebarStyled from "./SessionSidebar.style";
import SessionListItem from "./SessionListItem";
import {
    useCopilotSessions,
    CopilotSessionSummary,
} from "../hooks/useCopilotSessions";
import Loading from "../../Loading";

interface SessionSidebarProps {
    activeSessionId: string | null;
    onSessionSelect: (sessionId: string) => void;
    onNewChat: () => void;
    dataHash?: string;
}

const SessionSidebar = ({
    activeSessionId,
    onSessionSelect,
    onNewChat,
    dataHash,
}: SessionSidebarProps) => {
    const { t } = useTranslation();
    const { sessions, isLoading, refresh } = useCopilotSessions(dataHash);
    const prevSessionIdRef = useRef(activeSessionId);

    // Refresh session list when active session changes (e.g. new chat created)
    useEffect(() => {
        if (
            activeSessionId &&
            activeSessionId !== prevSessionIdRef.current
        ) {
            refresh();
        }
        prevSessionIdRef.current = activeSessionId;
    }, [activeSessionId, refresh]);

    return (
        <SessionSidebarStyled data-cy="copilotV2SessionSidebar">
            <div className="sidebar-header">
                <h3>{t("copilotChatBot:sessions")}</h3>
            </div>
            <button className="new-chat-button" onClick={onNewChat} data-cy="copilotV2NewChat">
                + {t("copilotChatBot:newChat")}
            </button>
            <div className="session-list">
                {isLoading ? (
                    <Loading />
                ) : (
                    sessions.map((session: CopilotSessionSummary) => (
                        <SessionListItem
                            key={session._id}
                            session={session}
                            isActive={session._id === activeSessionId}
                            onClick={onSessionSelect}
                        />
                    ))
                )}
            </div>
        </SessionSidebarStyled>
    );
};

export default SessionSidebar;

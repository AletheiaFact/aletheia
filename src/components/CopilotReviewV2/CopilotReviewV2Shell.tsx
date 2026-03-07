import React, { useState, useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import { useAppSelector } from "../../store/store";
import CopilotReviewV2ShellStyled from "./CopilotReviewV2Shell.style";
import SessionSidebar from "./SessionSidebar/SessionSidebar";
import AssistantThread from "./ChatArea/AssistantThread";
import AssignmentBanner from "./ChatArea/AssignmentBanner";
import ModeSwitcher from "./ChatArea/ModeSwitcher";
import FormModeView from "./FormMode/FormModeView";
import ReportPreviewSidebar from "./ReportPreview/ReportPreviewSidebar";
import FactCheckReportToolUI from "./ToolUI/FactCheckReportToolUI";
import { useModeSwitcher } from "./hooks/useModeSwitcher";
import { Report } from "../../types/Report";

interface CopilotReviewV2ShellProps {
    sessionId: string | null;
    onSessionSelect: (sessionId: string) => void;
    onNewChat: () => void;
    editorReport: Report | null;
    classification?: string;
    dataHash: string;
    personalityId?: string;
    targetId?: string;
    claim?: any;
    content?: any;
    personality?: any;
}

const CopilotReviewV2Shell = ({
    sessionId,
    onSessionSelect,
    onNewChat,
    editorReport,
    classification,
    dataHash,
    personalityId,
    targetId,
    claim,
    content,
    personality,
}: CopilotReviewV2ShellProps) => {
    const { vw } = useAppSelector((state) => ({
        vw: state?.vw,
    }));
    const isMobile = vw?.sm;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { mode, switchMode } = useModeSwitcher("chat");

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const handleSessionSelect = useCallback(
        (id: string) => {
            onSessionSelect(id);
            if (isMobile) setSidebarOpen(false);
        },
        [onSessionSelect, isMobile]
    );

    const sidebarContent = (
        <SessionSidebar
            activeSessionId={sessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={onNewChat}
            dataHash={dataHash}
        />
    );

    return (
        <CopilotReviewV2ShellStyled data-cy="copilotV2Shell">
            {/* Sidebar: Drawer on mobile, inline on desktop */}
            {isMobile ? (
                <Drawer
                    open={sidebarOpen}
                    onClose={toggleSidebar}
                    variant="temporary"
                >
                    {sidebarContent}
                </Drawer>
            ) : (
                sidebarContent
            )}

            {/* Main area */}
            <div className="shell-main">
                <div className="shell-toolbar">
                    <div className="toolbar-left">
                        <button
                            className="sidebar-toggle"
                            onClick={toggleSidebar}
                            data-cy="copilotV2SidebarToggle"
                        >
                            &#9776;
                        </button>
                        <ModeSwitcher
                            mode={mode}
                            onModeChange={switchMode}
                        />
                    </div>
                </div>

                <div className="shell-content">
                    {mode === "chat" ? (
                        <>
                            <div className="chat-column">
                                <AssignmentBanner
                                    dataHash={dataHash}
                                    personalityId={personalityId}
                                    targetId={targetId}
                                />
                                <AssistantThread />
                            </div>
                            <FactCheckReportToolUI />
                            {!isMobile && (
                                <ReportPreviewSidebar
                                    editorReport={editorReport}
                                    classification={classification}
                                    claim={claim}
                                    content={content}
                                    personality={personality}
                                />
                            )}
                        </>
                    ) : (
                        <FormModeView
                            dataHash={dataHash}
                            personalityId={personalityId}
                            targetId={targetId}
                            editorReport={editorReport}
                        />
                    )}
                </div>
            </div>
        </CopilotReviewV2ShellStyled>
    );
};

export default CopilotReviewV2Shell;

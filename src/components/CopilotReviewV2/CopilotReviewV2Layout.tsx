import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Claim } from "../../types/Claim";
import { Report } from "../../types/Report";
import AletheiaRuntimeProvider from "./AletheiaRuntimeProvider";
import CopilotReviewV2Shell from "./CopilotReviewV2Shell";
import copilotApi from "../../api/copilotApi";
import reviewTaskApi from "../../api/reviewTaskApi";
import { EditorParser } from "../../../lib/editor-parser";
import { useAppSelector } from "../../store/store";

interface CopilotReviewV2LayoutProps {
    claim: Claim;
    content: any;
    personality?: any;
    claimReview?: any;
    dataHash: string;
}

const CopilotReviewV2Layout = ({
    claim,
    content,
    personality,
    claimReview,
    dataHash,
}: CopilotReviewV2LayoutProps) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [editorReport, setEditorReport] = useState<Report | null>(null);

    const { selectedContent } = useAppSelector((state) => ({
        selectedContent: state?.selectedContent,
    }));

    const classification = content?.props?.classification;

    // Read initial session ID from URL query param
    const initialSessionId = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        const params = new URLSearchParams(window.location.search);
        return params.get("session") || undefined;
    }, []);

    const updateUrlSession = useCallback((id: string | null) => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        if (id) {
            url.searchParams.set("session", id);
        } else {
            url.searchParams.delete("session");
        }
        window.history.replaceState({}, "", url.toString());
    }, []);

    const handleSessionIdChange = useCallback(
        (id: string | null) => {
            setSessionId(id);
            updateUrlSession(id);
        },
        [updateUrlSession]
    );

    const handleSessionSelect = useCallback(async (id: string) => {
        try {
            const { session } = await copilotApi.getSessionById(id);
            if (session) {
                handleSessionIdChange(session._id);
                const lastReportMsg = [...(session.messages || [])]
                    .reverse()
                    .find((msg: any) => msg.editorReport);
                setEditorReport(lastReportMsg?.editorReport || null);
            }
        } catch (error) {
            console.error("Failed to switch session:", error);
        }
    }, [handleSessionIdChange]);

    const handleNewChat = useCallback(async () => {
        try {
            const context = {
                claimDate: claim?.date,
                sentence: content?.content,
                personalityName: personality?.name || "",
                personalityNames: claim?.personalities
                    ?.map((p: any) => p.name)
                    .filter(Boolean) || [],
                claimTitle: claim?.title,
                contentModel: claim?.contentModel || "",
                topics: [],
            };

            if (sessionId) {
                await copilotApi.clearSession(sessionId);
            }
            const { session: newSession } = await copilotApi.createSession(
                dataHash,
                context
            );
            handleSessionIdChange(newSession._id);
            setEditorReport(null);
        } catch (error) {
            console.error("Failed to create new chat:", error);
        }
    }, [sessionId, dataHash, claim, content, personality, handleSessionIdChange]);

    const { t } = useTranslation();

    const handleNewReportFromAgent = useCallback(
        async (report: Report) => {
            try {
                const editorParser = new EditorParser();
                const cleanedReport =
                    editorParser.removeTrailingParagraph(report as any);
                const schema = editorParser.editor2schema(cleanedReport);
                const reviewDataHtml = editorParser.schema2html(schema);

                await reviewTaskApi.autoSaveDraft(
                    {
                        data_hash: dataHash,
                        machine: {
                            context: {
                                reviewData: {
                                    ...schema,
                                    reviewDataHtml,
                                },
                                review: {
                                    personality: personality?._id,
                                    target: claim?._id,
                                    isPartialReview: true,
                                },
                            },
                        },
                    },
                    t
                );
            } catch (error) {
                console.error("Failed to auto-save draft:", error);
            }
        },
        [dataHash, personality, claim, t]
    );

    return (
        <AletheiaRuntimeProvider
            dataHash={dataHash}
            claim={claim}
            sentence={content?.content}
            selectedContent={selectedContent}
            onEditorReportChange={setEditorReport}
            onNewReportFromAgent={handleNewReportFromAgent}
            initialSessionId={initialSessionId}
            sessionId={sessionId}
            onSessionIdChange={handleSessionIdChange}
        >
            <CopilotReviewV2Shell
                sessionId={sessionId}
                onSessionSelect={handleSessionSelect}
                onNewChat={handleNewChat}
                editorReport={editorReport}
                classification={classification}
                dataHash={dataHash}
                personalityId={personality?._id}
                targetId={claim?._id}
                claim={claim}
                content={content}
                personality={personality}
            />
        </AletheiaRuntimeProvider>
    );
};

export default CopilotReviewV2Layout;

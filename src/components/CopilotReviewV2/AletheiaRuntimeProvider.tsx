import React, {
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    useExternalStoreRuntime,
    ThreadMessageLike,
    AppendMessage,
    AssistantRuntimeProvider,
} from "@assistant-ui/react";
import copilotApi from "../../api/copilotApi";
import axios from "axios";
import { SenderEnum } from "../../types/enums";
import {
    CopilotSessionMessage,
    MessageContext,
} from "../../types/Copilot";
import { Report } from "../../types/Report";
import { Claim } from "../../types/Claim";

interface AletheiaRuntimeProviderProps {
    children: ReactNode;
    dataHash: string;
    claim: Claim;
    sentence: string;
    selectedContent?: any;
    onEditorReportChange?: (report: Report | null) => void;
    onNewReportFromAgent?: (report: Report) => void;
    initialSessionId?: string;
    sessionId: string | null;
    onSessionIdChange: (id: string | null) => void;
}

const isAuthError = (error: unknown): boolean =>
    axios.isAxiosError(error) && error.response?.status === 403;

const convertSessionMessage = (
    message: CopilotSessionMessage
): ThreadMessageLike => {
    return {
        role: message.sender === SenderEnum.User ? "user" : "assistant",
        content: [{ type: "text", text: message.content }],
    };
};

const AletheiaRuntimeProvider = ({
    children,
    dataHash,
    claim,
    sentence,
    selectedContent,
    onEditorReportChange,
    onNewReportFromAgent,
    initialSessionId,
    sessionId,
    onSessionIdChange,
}: AletheiaRuntimeProviderProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [messages, setMessages] = useState<CopilotSessionMessage[]>([]);
    // Track the sessionId that messages belong to, to detect external session changes
    const loadedSessionIdRef = useRef<string | null>(null);
    // Use refs to always have the latest values in callbacks without stale closures
    const sessionIdRef = useRef<string | null>(sessionId);
    sessionIdRef.current = sessionId;
    const dataHashRef = useRef(dataHash);
    dataHashRef.current = dataHash;
    const onSessionIdChangeRef = useRef(onSessionIdChange);
    onSessionIdChangeRef.current = onSessionIdChange;

    const context: MessageContext = React.useMemo(
        () => ({
            claimDate: claim?.date,
            sentence: sentence,
            personalityName: claim?.personalities?.[0]?.name || "",
            personalityNames:
                claim?.personalities?.map((p) => p.name).filter(Boolean) || [],
            claimTitle: claim?.title,
            contentModel: claim?.contentModel || "",
            topics:
                selectedContent?.topics
                    ?.map((t: any) =>
                        typeof t === "string" ? t : t.label || t.name || ""
                    )
                    .filter(Boolean) || [],
        }),
        [claim, sentence, selectedContent]
    );
    const contextRef = useRef(context);
    contextRef.current = context;

    const restoreSession = useCallback(
        (session: any) => {
            onSessionIdChange(session._id);
            loadedSessionIdRef.current = session._id;
            if (session.messages?.length > 0) {
                setMessages(session.messages);
                const lastReportMsg = [...session.messages]
                    .reverse()
                    .find(
                        (msg: CopilotSessionMessage) => msg.editorReport
                    );
                if (lastReportMsg?.editorReport) {
                    onEditorReportChange?.(lastReportMsg.editorReport);
                }
            } else {
                setMessages([]);
            }
        },
        [onSessionIdChange, onEditorReportChange]
    );

    // Load or create session on mount
    useEffect(() => {
        if (!dataHash) return;

        const initSession = async () => {
            try {
                // If a specific session was requested (e.g. from URL), load it
                if (initialSessionId) {
                    try {
                        const { session } =
                            await copilotApi.getSessionById(initialSessionId);
                        if (session) {
                            restoreSession(session);
                            return;
                        }
                    } catch {
                        // Fall through to default behavior
                    }
                }

                const { session } = await copilotApi.getSession(dataHash);

                if (session) {
                    restoreSession(session);
                } else {
                    const { session: newSession } =
                        await copilotApi.createSession(dataHash, context);
                    onSessionIdChange(newSession._id);
                    loadedSessionIdRef.current = newSession._id;
                }
            } catch (error) {
                if (!isAuthError(error)) {
                    console.error(
                        "Failed to initialize copilot session:",
                        error
                    );
                }
            }
        };

        initSession();
    }, [dataHash]);

    // Sync messages when sessionId changes externally (sidebar click, new chat)
    useEffect(() => {
        if (!sessionId || sessionId === loadedSessionIdRef.current) return;

        const loadSessionMessages = async () => {
            try {
                const { session } =
                    await copilotApi.getSessionById(sessionId);
                loadedSessionIdRef.current = sessionId;
                if (session?.messages?.length > 0) {
                    setMessages(session.messages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                if (!isAuthError(error)) {
                    console.error(
                        "Failed to load session messages:",
                        error
                    );
                }
                setMessages([]);
                loadedSessionIdRef.current = sessionId;
            }
        };

        loadSessionMessages();
    }, [sessionId]);

    const onNew = useCallback(
        async (message: AppendMessage) => {
            let activeSessionId = sessionIdRef.current;

            const textContent = message.content.find(
                (c) => c.type === "text"
            );
            if (!textContent || textContent.type !== "text") return;

            const userMessage: CopilotSessionMessage = {
                sender: SenderEnum.User,
                content: textContent.text,
                type: "info",
            };

            setMessages((prev) => [...prev, userMessage]);
            setIsRunning(true);

            // Lazy session creation: if no session exists, create one on-the-fly
            if (!activeSessionId) {
                const currentDataHash = dataHashRef.current;
                if (!currentDataHash) {
                    const errorMessage: CopilotSessionMessage = {
                        sender: SenderEnum.Assistant,
                        content:
                            "Unable to start a session. Please reload the page.",
                        type: "error",
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                    setIsRunning(false);
                    return;
                }

                try {
                    const { session: newSession } =
                        await copilotApi.createSession(
                            currentDataHash,
                            contextRef.current
                        );
                    activeSessionId = newSession._id;
                    sessionIdRef.current = activeSessionId;
                    loadedSessionIdRef.current = activeSessionId;
                    onSessionIdChangeRef.current(activeSessionId);
                } catch (createError) {
                    if (!isAuthError(createError)) {
                        console.error(
                            "Failed to create session on first message:",
                            createError
                        );
                    }
                    const errorMessage: CopilotSessionMessage = {
                        sender: SenderEnum.Assistant,
                        content: isAuthError(createError)
                            ? "loginRequired"
                            : "Could not create a chat session. Please reload the page and try again.",
                        type: "error",
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                    setIsRunning(false);
                    return;
                }
            }

            try {
                const {
                    data: { sender, content, editorReport },
                } = await copilotApi.sendMessage(
                    activeSessionId,
                    textContent.text
                );

                const assistantMessage: CopilotSessionMessage = {
                    sender,
                    content,
                    type: "info",
                    editorReport,
                };

                setMessages((prev) => [...prev, assistantMessage]);

                if (editorReport) {
                    onEditorReportChange?.(editorReport);
                    onNewReportFromAgent?.(editorReport);
                }
            } catch (error) {
                const errorMessage: CopilotSessionMessage = {
                    sender: SenderEnum.Assistant,
                    content:
                        "Sorry, something went wrong. Please try again.",
                    type: "error",
                };
                setMessages((prev) => [...prev, errorMessage]);
                console.error("Chat error:", error);
            } finally {
                setIsRunning(false);
            }
        },
        [onEditorReportChange, onNewReportFromAgent]
    );

    const convertMessage = useCallback(
        (message: CopilotSessionMessage): ThreadMessageLike => {
            return convertSessionMessage(message);
        },
        []
    );

    const runtime = useExternalStoreRuntime({
        isRunning,
        messages,
        convertMessage,
        onNew,
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
        </AssistantRuntimeProvider>
    );
};

export default AletheiaRuntimeProvider;

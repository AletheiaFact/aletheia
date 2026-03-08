import React from "react";
import {
    ThreadPrimitive,
    MessagePrimitive,
    ComposerPrimitive,
    useThread,
    useMessage,
} from "@assistant-ui/react";
import { useTranslation } from "next-i18next";
import AssistantThreadStyled from "./AssistantThread.style";

const UserMessage = () => (
    <MessagePrimitive.Root className="aui-user-message">
        <div className="message-bubble">
            <MessagePrimitive.Content />
        </div>
    </MessagePrimitive.Root>
);

const AssistantMessageContent = () => {
    const { t } = useTranslation();
    const content = useMessage((m) => m.content);
    const firstPart = content?.[0];
    const text =
        firstPart && "text" in firstPart ? firstPart.text : "";

    const i18nKey = `copilotChatBot:${text}`;
    const translated = t(i18nKey);
    const isTranslatable = translated !== i18nKey;

    if (isTranslatable) {
        return <p>{translated}</p>;
    }

    return <MessagePrimitive.Content />;
};

const AssistantMessage = () => (
    <MessagePrimitive.Root className="aui-assistant-message">
        <div className="message-content">
            <AssistantMessageContent />
        </div>
    </MessagePrimitive.Root>
);

const ThinkingIndicator = () => {
    const { t } = useTranslation();
    const isRunning = useThread((s) => s.isRunning);

    if (!isRunning) return null;

    return (
        <div className="aui-thinking-indicator">
            <div className="thinking-content">
                <div className="thinking-dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                </div>
                <span className="thinking-text">
                    {t("copilotChatBot:agentLoadingThoughts")}
                </span>
            </div>
        </div>
    );
};

const AssistantThread = () => {
    const { t } = useTranslation();

    return (
        <AssistantThreadStyled>
            <ThreadPrimitive.Root className="aui-root">
                <ThreadPrimitive.Viewport className="aui-thread-viewport">
                    <ThreadPrimitive.Empty>
                        <div className="aui-thread-welcome">
                            <h2>
                                {t("copilotChatBot:welcomeTitle")}
                            </h2>
                            <p>
                                {t("copilotChatBot:welcomeDescription")}
                            </p>
                        </div>
                    </ThreadPrimitive.Empty>

                    <ThreadPrimitive.Messages
                        components={{
                            UserMessage,
                            AssistantMessage,
                        }}
                    />

                    <ThinkingIndicator />
                </ThreadPrimitive.Viewport>

                <ComposerPrimitive.Root className="aui-composer">
                    <div className="composer-inner">
                        <ComposerPrimitive.Input
                            placeholder={t(
                                "copilotChatBot:inputPlaceholder"
                            )}
                            className="aui-composer-input"
                        />
                        <ComposerPrimitive.Send className="aui-composer-send">
                            &#10148;
                        </ComposerPrimitive.Send>
                    </div>
                </ComposerPrimitive.Root>
            </ThreadPrimitive.Root>
        </AssistantThreadStyled>
    );
};

export default AssistantThread;

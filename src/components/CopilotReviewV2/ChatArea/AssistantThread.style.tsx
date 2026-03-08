import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";

const AssistantThreadStyled = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    background: ${colors.white};
    overflow: hidden;

    .aui-root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .aui-thread-viewport {
        flex: 1;
        overflow-y: auto;
        padding: 24px 32px;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: ${colors.neutralTertiary};
            border-radius: 3px;
        }
    }

    .aui-thread-welcome {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 40px;

        h2 {
            font-size: 24px;
            font-weight: 700;
            color: ${colors.primary};
            margin-bottom: 8px;
        }

        p {
            font-size: 14px;
            color: ${colors.secondary};
            max-width: 400px;
        }
    }

    .aui-user-message {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 16px;

        .message-bubble {
            max-width: 70%;
            padding: 12px 16px;
            background: rgb(37, 99, 235);
            color: ${colors.white};
            border-radius: 16px 16px 4px 16px;
            font-size: 14px;
            line-height: 1.5;
        }
    }

    .aui-assistant-message {
        display: flex;
        margin-bottom: 16px;

        .message-content {
            max-width: 80%;
            padding: 12px 16px;
            background: ${colors.lightNeutral};
            color: ${colors.black};
            border-radius: 16px 16px 16px 4px;
            font-size: 14px;
            line-height: 1.5;

            p {
                margin: 0 0 8px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            ul,
            ol {
                margin: 4px 0;
                padding-left: 20px;
            }

            code {
                background: rgba(0, 0, 0, 0.06);
                padding: 2px 4px;
                border-radius: 4px;
                font-size: 13px;
            }
        }
    }

    .aui-thinking-indicator {
        display: flex;
        margin-bottom: 16px;

        .thinking-content {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: ${colors.lightNeutral};
            border-radius: 16px 16px 16px 4px;
        }

        .thinking-dots {
            display: flex;
            gap: 4px;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${colors.neutralTertiary};
            animation: thinking-bounce 1.4s ease-in-out infinite;

            &:nth-child(2) {
                animation-delay: 0.2s;
            }
            &:nth-child(3) {
                animation-delay: 0.4s;
            }
        }

        .thinking-text {
            font-size: 13px;
            color: ${colors.neutralSecondary};
            font-style: italic;
        }

        @keyframes thinking-bounce {
            0%, 80%, 100% {
                transform: scale(0.6);
                opacity: 0.4;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    }

    .aui-composer {
        border-top: 1px solid ${colors.lightNeutralSecondary};
        padding: 16px 32px;
        background: ${colors.white};

        .composer-inner {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            max-width: 800px;
            margin: 0 auto;
        }

        .aui-composer-input {
            flex: 1;
            min-height: 44px;
            max-height: 200px;
            padding: 10px 16px;
            border: 1px solid ${colors.neutralTertiary};
            border-radius: 12px;
            font-size: 14px;
            resize: none;
            outline: none;
            font-family: inherit;

            &:focus {
                border-color: rgb(37, 99, 235);
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
            }

            &::placeholder {
                color: ${colors.neutralSecondary};
            }
        }

        .aui-composer-send {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 12px;
            background: rgb(37, 99, 235);
            color: ${colors.white};
            cursor: pointer;
            transition: background 0.15s;
            flex-shrink: 0;

            &:hover {
                background: rgb(29, 78, 216);
            }

            &:disabled {
                background: ${colors.neutralTertiary};
                cursor: not-allowed;
            }
        }
    }

    @media ${queries.sm} {
        .aui-thread-viewport {
            padding: 16px;
        }

        .aui-composer {
            padding: 12px 16px;
        }

        .aui-user-message .message-bubble,
        .aui-assistant-message .message-content {
            max-width: 90%;
        }
    }
`;

export default AssistantThreadStyled;

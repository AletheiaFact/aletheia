import { createMachine, interpret } from "xstate";
import * as actions from "./chat-bot-actions";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";

export interface ChatBotContext {
    verificationRequest: string;
    responseMessage: string;
    additionalInfo?: string;
    email?: string;
}

export const createChatBotMachine = (
    verificationRequestStateMachineService: VerificationRequestStateMachineService,
    value?,
    context?,
    chatbotStateId?
) => {
    const chatBotMachine = createMachine<ChatBotContext>(
        {
            id: "chatBot",
            initial: value || "greeting",
            context: context || {
                verificationRequest: "",
                responseMessage: "",
                additionalInfo: "",
                email: "",
            },
            states: {
                greeting: {
                    on: {
                        ASK_IF_VERIFICATION_REQUEST: {
                            target: "askingIfVerificationRequest",
                            actions: ["sendGreeting", "setResponseMessage"],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingIfVerificationRequest",
                            actions: [
                                "sendNoTextMessageGreeting",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingIfVerificationRequest: {
                    on: {
                        RECEIVE_YES: {
                            target: "askingForVerificationRequest",
                            actions: [
                                "askForVerificationRequest",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_PAUSE_MACHINE: {
                            target: "pausedMachine",
                            actions: [
                                "sendPausedMachineMessage",
                                "setResponseMessage",
                            ],
                        },
                        NOT_UNDERSTOOD: {
                            target: "askingIfVerificationRequest",
                            actions: [
                                "sendNotUnderstoodMessage",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingIfVerificationRequest",
                            actions: [
                                "sendNoTextMessageAskIfForVerificationRequest",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                pausedMachine: {
                    on: {
                        RETURN_TO_CHAT: {
                            target: "askingForVerificationRequest",
                            actions: [
                                "askForVerificationRequest",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingForVerificationRequest: {
                    on: {
                        RECEIVE_REPORT: {
                            target: "askingForAdditionalInfo",
                            actions: [
                                "saveVerificationRequest",
                                "askForAdditionalInfo",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForVerificationRequest",
                            actions: [
                                "sendNoTextMessageAskForVerificationRequest",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingForAdditionalInfo: {
                    on: {
                        RECEIVE_ADDITIONAL_INFO: {
                            target: "askingForEmail",
                            actions: [
                                "saveAdditionalInfo",
                                "askForEmail",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "askingForEmail",
                            actions: [
                                "saveEmptyAdditionalInfo",
                                "askForEmail",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForAdditionalInfo",
                            actions: [
                                "sendNoTextMessageAskForAdditionalInfo",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingForEmail: {
                    on: {
                        RECEIVE_EMAIL: {
                            target: "finishedReport",
                            actions: [
                                "saveEmail",
                                "sendThanks",
                                "setResponseMessage",
                                "saveVerificationRequestToDB",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "finishedReport",
                            actions: [
                                "saveEmptyEmail",
                                "sendThanks",
                                "setResponseMessage",
                                "saveVerificationRequestToDB",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForEmail",
                            actions: [
                                "sendNoTextMessageAskForEmail",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                finishedReport: {
                    on: {
                        RECEIVE_YES: {
                            target: "askingForVerificationRequest",
                            actions: [
                                "askForVerificationRequest",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_PAUSE_MACHINE: {
                            target: "pausedMachine",
                            actions: [
                                "sendPausedMachineMessage",
                                "setResponseMessage",
                            ],
                        },
                        ANY_TEXT_MESSAGE: {
                            target: "askingIfVerificationRequest",
                            actions: ["sendGreeting", "setResponseMessage"],
                        },
                    },
                },
            },
        },
        {
            actions: {
                ...actions,
                saveVerificationRequestToDB: (context) => {
                    const verificationRequestBody = {
                        content: context.verificationRequest,
                        additionalInfo: context.additionalInfo || "",
                        email: context.email || "",
                        date: new Date(),
                    };

                    verificationRequestStateMachineService.request(verificationRequestBody);
                },
            },
        }
    );

    return interpret(chatBotMachine).start();
};

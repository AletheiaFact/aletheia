import { createMachine, interpret } from "xstate";
import * as actions from "./chat-bot-actions";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";

export interface ChatBotContext {
    verificationRequest: string;
    responseMessage: string;
    source?: { href: string }[];
    publicationDate?: string;
    heardFrom?: string;
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
                source: [],
                publicationDate: "",
                heardFrom: "",
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
                            target: "askingForSource",
                            actions: [
                                "saveVerificationRequest",
                                "askForSource",
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
                askingForSource: {
                    on: {
                        RECEIVE_SOURCE: {
                            target: "askingForPublicationDate",
                            actions: [
                                "saveSource",
                                "askForPublicationDate",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "askingForPublicationDate",
                            actions: [
                                "saveEmptySource",
                                "askForPublicationDate",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForSource",
                            actions: [
                                "sendNoTextMessageAskForSource",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingForPublicationDate: {
                    on: {
                        RECEIVE_PUBLICATION_DATE: {
                            target: "askingForHeardFrom",
                            actions: [
                                "savePublicationDate",
                                "askForHeardFrom",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "askingForHeardFrom",
                            actions: [
                                "saveEmptyPublicationDate",
                                "askForHeardFrom",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForPublicationDate",
                            actions: [
                                "sendNoTextMessageAskForPublicationDate",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingForHeardFrom: {
                    on: {
                        RECEIVE_HEARD_FROM: {
                            target: "askingForEmail",
                            actions: [
                                "saveHeardFrom",
                                "askForEmail",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "askingForEmail",
                            actions: [
                                "saveEmptyHeardFrom",
                                "askForEmail",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForHeardFrom",
                            actions: [
                                "sendNoTextMessageAskForHeardFrom",
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
                        source: context.source || [],
                        publicationDate: context.publicationDate || "",
                        email: context.email || "",
                        date: new Date(),
                        heardFrom: context.heardFrom || "",
                    };

                    verificationRequestStateMachineService.request(
                        verificationRequestBody,
                        chatbotStateId
                    );
                },
            },
        }
    );

    return interpret(chatBotMachine).start();
};

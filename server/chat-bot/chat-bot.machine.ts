import { createMachine, interpret } from "xstate";
import * as actions from "./chat-bot-actions";
import { VerificationRequestService } from "../verification-request/verification-request.service";

export interface ChatBotContext {
    verificationRequest: string;
    responseMessage: string;
}

export const createChatBotMachine = (
    verificationRequestService: VerificationRequestService
) => {
    const chatBotMachine = createMachine<ChatBotContext>(
        {
            id: "chatBot",
            initial: "greeting",
            context: {
                verificationRequest: "",
                responseMessage: "",
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
                        RECEIVE_NO: {
                            target: "sendingNoMessage",
                            actions: ["sendNoMessage", "setResponseMessage"],
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
                askingForVerificationRequest: {
                    on: {
                        RECEIVE_REPORT: {
                            target: "finishedReport",
                            actions: [
                                "saveVerificationRequest",
                                "sendThanks",
                                "setResponseMessage",
                                "saveVerificationRequestToDB",
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
                finishedReport: {
                    on: {
                        RECEIVE_YES: {
                            target: "askingForVerificationRequest",
                            actions: [
                                "askForVerificationRequest",
                                "setResponseMessage",
                            ],
                        },
                        ANY_TEXT_MESSAGE: {
                            target: "askingIfVerificationRequest",
                            actions: ["sendGreeting", "setResponseMessage"],
                        },
                    },
                },
                sendingNoMessage: {
                    on: {
                        ASK_TO_REPORT: {
                            target: "askingForVerificationRequest",
                            actions: [
                                "askForVerificationRequest",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "sendingNoMessage",
                            actions: ["sendNoMessage", "setResponseMessage"],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "sendingNoMessage",
                            actions: [
                                "sendNoTextMessageNoMessage",
                                "setResponseMessage",
                            ],
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
                        date: new Date(),
                        sources: [],
                        data_hash: "",
                    };

                    verificationRequestService.create(verificationRequestBody);
                },
            },
        }
    );

    return interpret(chatBotMachine);
};

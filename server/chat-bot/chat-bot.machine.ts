import { createMachine, interpret, assign } from "xstate";
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
                    },
                },
                askingForVerificationRequest: {
                    on: {
                        RECEIVE_REPORT: {
                            target: "askingIfVerificationRequest",
                            actions: [
                                "saveVerificationRequest",
                                "sendThanks",
                                "setResponseMessage",
                                "saveVerificationRequestToDB",
                            ],
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
                    },
                },
            },
        },
        {
            actions: {
                ...actions,
                saveVerificationRequestToDB: (context) => {
                    verificationRequestService.createVerificationRequest(
                        context.verificationRequest
                    );
                },
            },
        }
    );

    return interpret(chatBotMachine);
};

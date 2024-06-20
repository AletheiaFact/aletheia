import { createMachine, interpret } from "xstate";
import * as actions from "./chat-bot-actions";

export interface ChatBotContext {
    verificationRequest: string;
    responseMessage: string;
}

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
                            "askForForVerificationRequest",
                            "setResponseMessage",
                        ],
                    },
                    RECEIVE_NO: {
                        target: "sendingNoMessage",
                        actions: ["sendNoMessage", "setResponseMessage"],
                    },
                    NOT_UNDERSTOOD: {
                        target: "notUnderstood",
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
                        target: "askingToRequestMore",
                        actions: [
                            "saveVerificationRequest",
                            "sendThanks",
                            "setResponseMessage",
                        ],
                    },
                },
            },
            askingToRequestMore: {
                on: {
                    RECEIVE_YES: {
                        target: "askingForVerificationRequest",
                        actions: [
                            "askForForVerificationRequest",
                            "setResponseMessage",
                        ],
                    },
                    RECEIVE_NO: {
                        target: "sendingNoMessage",
                        actions: ["sendNoMessage", "setResponseMessage"],
                    },
                    NOT_UNDERSTOOD: {
                        target: "notUnderstood",
                        actions: [
                            "sendNotUnderstoodMessage",
                            "setResponseMessage",
                        ],
                    },
                },
            },
            sendingNoMessage: {
                on: {
                    ASK_TO_REPORT: {
                        target: "askingForVerificationRequest",
                        actions: [
                            "askForForVerificationRequest",
                            "setResponseMessage",
                        ],
                    },
                    RECEIVE_NO: {
                        target: "sendingNoMessage",
                        actions: ["sendNoMessage", "setResponseMessage"],
                    },
                },
            },
            notUnderstood: {
                on: {
                    RECEIVE_YES: {
                        target: "askingForVerificationRequest",
                        actions: [
                            "askForForVerificationRequest",
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
        actions,
    }
);

const chatBotMachineService = interpret(chatBotMachine);

chatBotMachineService.start();

export default chatBotMachineService;

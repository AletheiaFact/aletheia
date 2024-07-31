import { createMachine, interpret } from "xstate";
import * as actions from "./chat-bot-actions";
import { VerificationRequestService } from "../verification-request/verification-request.service";

export interface ChatBotContext {
    verificationRequest: string;
    responseMessage: string;
    link?: string;
    publicationDate?: string;
    sources?: string;
    email?: string;
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
                link: "",
                publicationDate: "",
                sources: "",
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
                            target: "askingForLink",
                            actions: [
                                "saveVerificationRequest",
                                "askForLink",
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
                askingForLink: {
                    on: {
                        RECEIVE_LINK: {
                            target: "askingForPublicationDate",
                            actions: [
                                "saveLink",
                                "askForPublicationDate",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "askingForPublicationDate",
                            actions: [
                                "saveEmptyLink",
                                "askForPublicationDate",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForLink",
                            actions: [
                                "noTextMessageAskForLink",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingForPublicationDate: {
                    on: {
                        RECEIVE_PUBLICATION_DATE: {
                            target: "askingForSource",
                            actions: [
                                "savePublicationDate",
                                "askForSource",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "askingForSource",
                            actions: [
                                "saveEmptyPublicationDate",
                                "askForSource",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForPublicationDate",
                            actions: [
                                "noTextMessageAskForPublicationDate",
                                "setResponseMessage",
                            ],
                        },
                    },
                },
                askingForSource: {
                    on: {
                        RECEIVE_SOURCE: {
                            target: "askingForEmail",
                            actions: [
                                "saveSource",
                                "askForEmail",
                                "setResponseMessage",
                            ],
                        },
                        RECEIVE_NO: {
                            target: "askingForEmail",
                            actions: [
                                "saveEmptySource",
                                "askForEmail",
                                "setResponseMessage",
                            ],
                        },
                        NON_TEXT_MESSAGE: {
                            target: "askingForSource",
                            actions: [
                                "noTextMessageAskForSource",
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
                                "noTextMessageAskForEmail",
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
                        ANY_TEXT_MESSAGE: {
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
                        link: context.link || "",
                        publicationDate: context.publicationDate || "",
                        email: context.email || "",
                        date: new Date(),
                        sources: [context.sources || ""],
                        data_hash: "",
                    };

                    verificationRequestService.create(verificationRequestBody);
                },
            },
        }
    );

    return interpret(chatBotMachine);
};

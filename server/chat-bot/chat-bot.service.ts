import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { createChatBotMachine } from "./chat-bot.machine";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { ConfigService } from "@nestjs/config";
import { ChatBotStateService } from "../chat-bot-state/chat-bot-state.service";

const diacriticsRegex = /[\u0300-\u036f]/g;
const MESSAGE_MAP = {
    sim: "RECEIVE_YES",
    nao: "RECEIVE_PAUSE_MACHINE",
};

interface ChatBotContext {
    verificationRequest?: string;
    responseMessage?: string;
    source?: string;
    publicationDate?: string;
    heardFrom?: string;
    email?: string;
}

@Injectable()
export class ChatbotService {
    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService,
        private verificationService: VerificationRequestService,
        private chatBotStateService: ChatBotStateService
    ) {}

    private async getOrCreateChatBotMachine(from: string, channel: string) {
        const id = `${channel}-${from}`;
        let chatbotState = await this.chatBotStateService.getById(id);

        if (!chatbotState) {
            chatbotState = await this.createNewChatBotState(id);
        } else {
            chatbotState = this.rehydrateChatBotState(chatbotState);
        }

        return chatbotState;
    }

    private async createNewChatBotState(id: string) {
        const newMachine = createChatBotMachine(this.verificationService);
        const snapshot = newMachine.getSnapshot();
        return await this.chatBotStateService.create(
            {
                value: snapshot.value,
                context: snapshot.context as ChatBotContext,
            },
            id
        );
    }

    private rehydrateChatBotState(chatbotState) {
        const rehydratedMachine = createChatBotMachine(
            this.verificationService,
            chatbotState.machine.value,
            chatbotState.machine.context
        );
        const snapshot = rehydratedMachine.getSnapshot();
        chatbotState.machine.value = snapshot.value;
        chatbotState.machine.context = snapshot.context as ChatBotContext;
        return chatbotState;
    }

    private async updateChatBotState(chatbotState) {
        const snapshot = {
            value: chatbotState.machine.value,
            context: chatbotState.machine.context,
        };
        await this.chatBotStateService.updateSnapshot(
            chatbotState._id,
            snapshot
        );
    }

    public async sendMessage(message): Promise<Observable<AxiosResponse<any>>> {
        const { api_base_url, api_token } = this.configService.get("zenvia");
        const { from, to, channel, contents } = message;

        const api_url = `${api_base_url}/${channel}/messages`;

        const chatbotState = await this.getOrCreateChatBotMachine(
            from,
            channel
        );
        const chatBotMachineService = createChatBotMachine(
            this.verificationService,
            chatbotState.machine.value,
            chatbotState.machine.context
        );

        chatBotMachineService.start(chatbotState.machine.value);

        const userMessage = contents[0].text;
        const messageType = message.contents[0].type;
        this.handleUserMessage(userMessage, messageType, chatBotMachineService);

        const snapshot = chatBotMachineService.getSnapshot();
        if (this.shouldPauseMachine(chatbotState, snapshot)) {
            return;
        }
        chatbotState.machine.value = snapshot.value;
        chatbotState.machine.context = snapshot.context;

        await this.updateChatBotState(chatbotState);

        const responseMessage = snapshot.context.responseMessage;

        const body = this.createResponseBody(to, from, responseMessage);

        return this.sendHttpPost(api_url, api_token, body);
    }

    private shouldPauseMachine(chatbotState, snapshot) {
        return (
            chatbotState.machine.value === "pausedMachine" &&
            snapshot.value === "pausedMachine"
        );
    }

    private createResponseBody(to, from, responseMessage) {
        return {
            from: to,
            to: from,
            contents: [{ type: "text", text: responseMessage }],
        };
    }

    private sendHttpPost(
        api_url,
        api_token,
        body
    ): Observable<AxiosResponse<any>> {
        return this.httpService
            .post(api_url, body, {
                headers: { "X-API-TOKEN": api_token },
            })
            .pipe(
                map((response) => response),
                catchError((error) => throwError(() => new Error(error)))
            );
    }

    private handleUserMessage(
        message: string,
        messageType,
        chatBotMachineService
    ) {
        const currentState = chatBotMachineService.getSnapshot().value;

        if (this.isNonTextMessage(messageType, currentState)) {
            chatBotMachineService.send("NON_TEXT_MESSAGE");
            return;
        }

        const parsedMessage = this.normalizeAndLowercase(message);

        switch (currentState) {
            case "greeting":
                chatBotMachineService.send("ASK_IF_VERIFICATION_REQUEST");
                break;
            case "askingIfVerificationRequest":
                this.handleMachineEventSend(
                    parsedMessage,
                    chatBotMachineService
                );
                break;
            case "pausedMachine":
                this.handlePausedMachineState(
                    parsedMessage,
                    chatBotMachineService
                );
                break;
            case "askingForVerificationRequest":
                chatBotMachineService.send({
                    type: "RECEIVE_REPORT",
                    verificationRequest: message,
                });
                break;
            case "askingForSource":
            case "askingForPublicationDate":
            case "askingForHeardFrom":
            case "askingForEmail":
                this.handleOptionalInfoState(
                    parsedMessage,
                    currentState,
                    message,
                    chatBotMachineService
                );
                break;
            case "finishedReport":
                this.handleMachineFinishEventSend(
                    parsedMessage,
                    chatBotMachineService
                );
                break;
            default:
                console.warn(`Unhandled state: ${currentState}`);
        }
    }

    private isNonTextMessage(messageType, currentState) {
        return messageType !== "text" && currentState !== "pausedMachine";
    }

    private normalizeAndLowercase(message: string): string {
        return message
            .normalize("NFD")
            .replace(diacriticsRegex, "")
            .toLowerCase();
    }

    private handleMachineEventSend(
        parsedMessage: string,
        chatBotMachineService
    ): void {
        chatBotMachineService.send(
            MESSAGE_MAP[parsedMessage] || "NOT_UNDERSTOOD"
        );
    }

    private handlePausedMachineState(
        parsedMessage: string,
        chatBotMachineService
    ): void {
        if (parsedMessage === "denuncia") {
            chatBotMachineService.send("RETURN_TO_CHAT");
        }
    }

    private handleMachineFinishEventSend(
        parsedMessage: string,
        chatBotMachineService
    ): void {
        let event = "ANY_TEXT_MESSAGE";

        if (parsedMessage === "sim") {
            event = "RECEIVE_YES";
        } else if (parsedMessage === "conversa") {
            event = "RECEIVE_PAUSE_MACHINE";
        }

        chatBotMachineService.send(event);
    }

    private handleOptionalInfoState(
        parsedMessage: string,
        currentState: string,
        message: string,
        chatBotMachineService
    ): void {
        const stateMapping = {
            askingForSource: {
                receive: "RECEIVE_SOURCE",
                empty: "RECEIVE_NO",
                field: "source",
            },
            askingForPublicationDate: {
                receive: "RECEIVE_PUBLICATION_DATE",
                empty: "RECEIVE_NO",
                field: "publicationDate",
            },
            askingForHeardFrom: {
                receive: "RECEIVE_HEARD_FROM",
                empty: "RECEIVE_NO",
                field: "heardFrom",
            },
            askingForEmail: {
                receive: "RECEIVE_EMAIL",
                empty: "RECEIVE_NO",
                field: "email",
            },
        };

        const { receive, empty, field } = stateMapping[currentState];

        chatBotMachineService.send({
            type: parsedMessage === "nao" ? empty : receive,
            [field]: message,
        });
    }
}

import { Injectable, Scope, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError } from "rxjs/operators";
import { lastValueFrom, throwError } from "rxjs";
import { createChatBotMachine } from "./chat-bot.machine";
import { ConfigService } from "@nestjs/config";
import { ChatBotStateService } from "../chat-bot-state/chat-bot-state.service";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
import { Roles } from "../auth/ability/ability.factory";
import { M2M } from "../entities/m2m.entity";
import * as crypto from "crypto";

const diacriticsRegex = /[\u0300-\u036f]/g;
const MESSAGE_MAP = {
    sim: "RECEIVE_YES",
    nao: "RECEIVE_PAUSE_MACHINE",
};

interface ChatBotContext {
    verificationRequest?: string;
    responseMessage?: string;
    additionalInfo?: string;
    email?: string;
    sourceChannel?: string;
    dataHash?: string;
}

function M2MUser(clientId): M2M {
    return {
        isM2M: true,
        clientId,
        subject: "chatbot-service",
        scopes: ["read", "write"],
        role: {
            main: Roles.Integration,
        },
        namespace: "main",
    };
}

@Injectable({ scope: Scope.REQUEST })
export class ChatbotService {
    private readonly logger = new Logger(ChatbotService.name);

    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly verificationRequestStateMachineService: VerificationRequestStateMachineService,
        private chatBotStateService: ChatBotStateService
    ) {}

    private async getOrCreateChatBotMachine(data_hash: string) {
        let chatbotState = await this.chatBotStateService.getByDataHash(
            data_hash
        );

        if (!chatbotState) {
            chatbotState = await this.createNewChatBotState(data_hash);
        } else {
            chatbotState = this.rehydrateChatBotState(chatbotState);
        }

        return chatbotState;
    }

    private async createNewChatBotState(data_hash: string) {
        const newMachine = createChatBotMachine(
            this.verificationRequestStateMachineService
        );
        const snapshot = newMachine.getSnapshot();
        return await this.chatBotStateService.create(
            {
                value: snapshot.value,
                context: snapshot.context as ChatBotContext,
            },
            data_hash
        );
    }

    private rehydrateChatBotState(chatbotState) {
        const rehydratedMachine = createChatBotMachine(
            this.verificationRequestStateMachineService,
            chatbotState.machine.value,
            chatbotState.machine.context,
            chatbotState._id
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

    public async sendMessage(message): Promise<void> {
        const { from, to, channel, contents } = message;
        this.logger.log(
            `Received message [channel=${channel}, from=${from}, state=processing]`
        );

        if (!contents?.length || !contents[0]) {
            this.logger.warn(
                `Empty or invalid contents received [channel=${channel}, from=${from}]`
            );
            return;
        }

        const { api_url, api_token } = this.configService.get("zenvia");
        const hashSecretKey = this.configService.get<string>("hashSecretKey");

        const data_hash = crypto
            .createHmac("sha256", hashSecretKey ?? "")
            .update(`${channel}-${from}`)
            .digest("hex");

        const channel_api_url = `${api_url}/${channel}/messages`;

        const chatbotState = await this.getOrCreateChatBotMachine(data_hash);
        if (!chatbotState) {
            this.logger.warn(
                `Failed to get or create chatbot state [dataHash=${data_hash}]`
            );
            return;
        }
        this.logger.log(
            `Machine state [dataHash=${data_hash}, currentState=${chatbotState.machine.value}]`
        );

        const chatBotMachineService = createChatBotMachine(
            this.verificationRequestStateMachineService,
            chatbotState.machine.value,
            {
                ...chatbotState.machine.context,
                sourceChannel: channel,
            },
            M2MUser(chatbotState._id)
        );

        chatBotMachineService.start(chatbotState.machine.value);

        const userMessage = contents[0].text;
        const messageType = contents[0].type;
        this.handleUserMessage(userMessage, messageType, chatBotMachineService);

        const snapshot = chatBotMachineService.getSnapshot();
        if (this.shouldPauseMachine(chatbotState, snapshot)) {
            this.logger.log(
                `Machine paused [channel=${channel}, from=${from}]`
            );
            return;
        }
        chatbotState.machine.value = snapshot.value;
        chatbotState.machine.context = snapshot.context;

        await this.updateChatBotState(chatbotState);
        this.logger.log(
            `State updated [dataHash=${data_hash}, newState=${snapshot.value}]`
        );

        const responseMessage = snapshot.context.responseMessage;

        const body = this.createResponseBody(to, from, responseMessage);

        await this.sendZenviaResponse(
            channel_api_url,
            api_token,
            body,
            channel,
            from
        );
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

    private async sendZenviaResponse(
        channel_api_url: string,
        api_token: string,
        body: any,
        channel: string,
        from: string
    ): Promise<void> {
        try {
            await lastValueFrom(
                this.httpService
                    .post(channel_api_url, body, {
                        headers: { "X-API-TOKEN": api_token },
                    })
                    .pipe(
                        catchError((error) => {
                            const status = error.response?.status;
                            const data = JSON.stringify(error.response?.data);
                            this.logger.error(
                                `Zenvia API error [channel=${channel}, from=${from}, status=${status}]: ${data}`
                            );
                            return throwError(() => error);
                        })
                    )
            );
            this.logger.log(
                `Response sent to Zenvia [channel=${channel}, from=${from}]`
            );
        } catch (error) {
            this.logger.error(
                `Failed to send response to Zenvia [channel=${channel}, from=${from}]: ${error.message}`
            );
            throw error;
        }
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
            case "askingForAdditionalInfo":
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
                this.logger.warn(`Unhandled state: ${currentState}`);
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
            askingForAdditionalInfo: {
                receive: "RECEIVE_ADDITIONAL_INFO",
                empty: "RECEIVE_NO",
                field: "additionalInfo",
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

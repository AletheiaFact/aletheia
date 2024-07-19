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
    nao: "RECEIVE_NO",
};

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
            const newMachine = createChatBotMachine(this.verificationService);
            newMachine.start();
            chatbotState = await this.chatBotStateService.create(
                newMachine.getSnapshot().value,
                id
            );
        } else {
            const rehydratedMachine = createChatBotMachine(
                this.verificationService
            );
            rehydratedMachine.start(chatbotState.state);
            chatbotState.state = rehydratedMachine.getSnapshot();
        }

        return chatbotState;
    }

    private async saveChatBotState(chatbotState) {
        await this.chatBotStateService.updateState(
            chatbotState._id,
            chatbotState.state
        );
    }

    public async sendMessage(message): Promise<Observable<AxiosResponse<any>>> {
        const { api_url, api_token } = this.configService.get("zenvia");
        const { from, channel, contents } = message;

        const chatbotState = await this.getOrCreateChatBotMachine(
            from,
            channel
        );
        const chatBotMachineService = createChatBotMachine(
            this.verificationService
        );
        chatBotMachineService.start(chatbotState.state);

        const userMessage = contents[0].text;
        this.handleUserMessage(userMessage, chatBotMachineService);

        const snapshot = chatBotMachineService.getSnapshot();
        chatbotState.state = snapshot.value;

        await this.saveChatBotState(chatbotState);

        const responseMessage = snapshot.context.responseMessage;

        const body = {
            from: message.to,
            to: message.from,
            contents: [{ type: "text", text: responseMessage }],
        };

        return this.httpService
            .post(api_url, body, {
                headers: { "X-API-TOKEN": api_token },
            })
            .pipe(
                map((response) => response),
                catchError((error) => throwError(() => new Error(error)))
            );
    }

    private handleUserMessage(message: string, chatBotMachineService) {
        const parsedMessage = this.normalizeAndLowercase(message);
        const currentState = chatBotMachineService.getSnapshot().value;

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
            case "askingForVerificationRequest":
                chatBotMachineService.send({
                    type: "RECEIVE_REPORT",
                    verificationRequest: message,
                });
                break;
            case "sendingNoMessage":
                this.handleSendingNoMessage(
                    parsedMessage,
                    chatBotMachineService
                );
                break;
            default:
                console.warn(`Unhandled state: ${currentState}`);
        }
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

    private handleSendingNoMessage(
        parsedMessage: string,
        chatBotMachineService
    ): void {
        chatBotMachineService.send(
            parsedMessage === "denuncia" ? "ASK_TO_REPORT" : "RECEIVE_NO"
        );
    }
}

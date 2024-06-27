import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { createChatBotMachine } from "./chat-bot.machine";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { ConfigService } from "@nestjs/config";

const diacriticsRegex = /[\u0300-\u036f]/g;
const MESSAGE_MAP = {
    sim: "RECEIVE_YES",
    nao: "RECEIVE_NO",
};

@Injectable()
export class ChatbotService {
    private chatBotMachineService;

    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService,
        private verificationService: VerificationRequestService
    ) {}

    onModuleInit() {
        this.initializeChatBotMachine();
    }

    private initializeChatBotMachine() {
        this.chatBotMachineService = createChatBotMachine(
            this.verificationService
        );
        this.chatBotMachineService.start();
    }

    //TODO: Find a better way to interpret the user's message.
    private normalizeAndLowercase(message: string): string {
        return message
            .normalize("NFD")
            .replace(diacriticsRegex, "")
            .toLowerCase();
    }

    private handleMachineEventSend(parsedMessage: string): void {
        this.chatBotMachineService.send(
            MESSAGE_MAP[parsedMessage] || "NOT_UNDERSTOOD"
        );
    }

    private handleSendingNoMessage(parsedMessage: string): void {
        this.chatBotMachineService.send(
            parsedMessage === "denuncia" ? "ASK_TO_REPORT" : "RECEIVE_NO"
        );
    }

    private handleUserMessage(message): void {
        const messageType = message.contents[0].type;
        const userMessage = message.contents[0].text;

        if (messageType !== "text") {
            this.chatBotMachineService.send("NON_TEXT_MESSAGE");
            return;
        }

        const parsedMessage = this.normalizeAndLowercase(userMessage);
        const currentState = this.chatBotMachineService.getSnapshot().value;

        switch (currentState) {
            case "greeting":
                this.chatBotMachineService.send("ASK_IF_VERIFICATION_REQUEST");
                break;
            case "askingIfVerificationRequest":
                this.handleMachineEventSend(parsedMessage);
                break;
            case "askingForVerificationRequest":
                this.chatBotMachineService.send({
                    type: "RECEIVE_REPORT",
                    verificationRequest: userMessage,
                });
                break;
            case "sendingNoMessage":
                this.handleSendingNoMessage(parsedMessage);
                break;
            default:
                console.warn(`Unhandled state: ${currentState}`);
        }
    }

    public sendMessage(message): Observable<AxiosResponse<any>> {
        const { api_url, api_token } = this.configService.get("zenvia");
        this.handleUserMessage(message);

        const snapshot = this.chatBotMachineService.getSnapshot();
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
}

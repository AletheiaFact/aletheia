import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import chatBotMachineService from "./chat-bot.machine";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class ChatbotService {
    private chatBotMachineService = chatBotMachineService;

    constructor(
        private configService: ConfigService,
        private readonly httpService: HttpService,
        private verificationService: VerificationRequestService
    ) {}

    //TODO: Find a better way to interpret the user's message.
    normalizeAndLowercase(message: string): string {
        return message
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    handleUserMessage(message: string) {
        const parsedMessage = this.normalizeAndLowercase(message);
        const currentState = this.chatBotMachineService.getSnapshot().value;

        switch (currentState) {
            case "greeting":
                this.chatBotMachineService.send("ASK_IF_VERIFICATION_REQUEST");
                break;
            case "askingIfVerificationRequest":
                if (parsedMessage === "sim") {
                    this.chatBotMachineService.send("RECEIVE_YES");
                } else if (parsedMessage === "nao") {
                    this.chatBotMachineService.send("RECEIVE_NO");
                } else {
                    this.chatBotMachineService.send("NOT_UNDERSTOOD");
                }
                break;
            case "askingForVerificationRequest":
                this.chatBotMachineService.send({
                    type: "RECEIVE_REPORT",
                    verificationRequest: message,
                });
                break;
            case "askingToRequestMore":
                if (parsedMessage === "sim") {
                    this.chatBotMachineService.send("RECEIVE_YES");
                } else if (parsedMessage === "nao") {
                    this.chatBotMachineService.send("RECEIVE_NO");
                } else {
                    this.chatBotMachineService.send("NOT_UNDERSTOOD");
                }
                break;
            case "sendingNoMessage":
                if (parsedMessage === "denuncia") {
                    this.chatBotMachineService.send("ASK_TO_REPORT");
                } else {
                    this.chatBotMachineService.send("RECEIVE_NO");
                }
                break;
            case "notUnderstood":
                if (parsedMessage === "sim") {
                    this.chatBotMachineService.send("RECEIVE_YES");
                } else if (parsedMessage === "nao") {
                    this.chatBotMachineService.send("RECEIVE_NO");
                } else {
                    this.chatBotMachineService.send("NOT_UNDERSTOOD");
                }
                break;
            default:
                console.warn(`Unhandled state: ${currentState}`);
        }
    }

    sendMessage(message): Observable<AxiosResponse<any>> {
        const { api_url, api_token } = this.configService.get("zenvia");

        this.handleUserMessage(message.contents[0].text);

        const snapshot = this.chatBotMachineService.getSnapshot();
        const verificationRequest = snapshot.context.verificationRequest;

        if (snapshot.value === "askingToRequestMore") {
            this.verificationService.createVerificationRequest(
                verificationRequest
            );
        }

        const responseMessage = snapshot.context.responseMessage;

        const body = {
            from: message.to,
            to: message.from,
            contents: [
                {
                    type: "text",
                    text: responseMessage,
                },
            ],
        };

        return this.httpService
            .post(api_url, body, {
                headers: {
                    "X-API-TOKEN": api_token,
                },
            })
            .pipe(
                map((response) => response),
                catchError((error) => throwError(() => new Error(error)))
            );
    }
}

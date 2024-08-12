import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseRequest } from "../types";
import { REQUEST } from "@nestjs/core";
const jwt = require("jsonwebtoken");

@Injectable({ scope: Scope.REQUEST })
export class AutomatedFactCheckingService {
    agenciaURL: string;

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        private configService: ConfigService
    ) {
        this.agenciaURL = this.configService.get<string>(
            "automatedFactCheckingAPIUrl"
        );
    }

    generateAccessToken() {
        return jwt.sign(this.req.user, process.env.AGENCIA_SECRET, {
            expiresIn: "24h",
        });
    }

    async getResponseFromAgents(data): Promise<{ stream: string; json: any }> {
        try {
            const accessToken = this.generateAccessToken();
            const params = {
                input: {
                    claim: data.claim,
                    context: data.context,
                    language: "Portuguese",
                    messages: [],
                    questions: [],
                    can_be_fact_checked: false,
                    search_type: data.searchType,
                },
            };

            const response = await fetch(`${this.agenciaURL}/invoke`, {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                keepalive: true,
            });

            let reader = response.body.getReader();

            let streamResponse = "";
            let done, value;

            while (!done) {
                ({ done, value } = await reader.read());
                streamResponse += new TextDecoder().decode(value, {
                    stream: true,
                });
            }

            const jsonResponse = JSON.parse(streamResponse);

            if (jsonResponse?.detail) {
                return { stream: jsonResponse.detail, json: {} };
            }

            if (jsonResponse?.message) {
                const report = JSON.parse(jsonResponse?.message?.messages);
                return { stream: streamResponse, json: { messages: report } };
            }

            return { stream: streamResponse, json: { messages: {} } };
        } catch (error) {
            throw new Error(`"Agencia's server error": ${error}`);
        }
    }
}

import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { BaseRequest } from "../types";
import { REQUEST } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable({ scope: Scope.REQUEST })
export class AutomatedFactCheckingService {
    agenciaURL: string;

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {
        this.agenciaURL = this.configService.get<string>(
            "automatedFactCheckingAPIUrl"
        );
    }

    async getResponseFromAgents(data): Promise<{ stream: string; json: any }> {
        try {
            const { access_token } = this.configService.get("agencia");
            const agenciaAccessToken = this.jwtService.sign(
                { sub: this.req.user._id },
                { secret: access_token, expiresIn: "15m" }
            );

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
                    Authorization: `Bearer ${agenciaAccessToken}`,
                },
                keepalive: true,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(
                    `Agencia returned HTTP ${response.status}: ${errorBody.substring(0, 200)}`
                );
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let streamResponse = "";
            let done, value;

            while (!done) {
                ({ done, value } = await reader.read());
                streamResponse += decoder.decode(value, { stream: true });
            }

            // Parse NDJSON: each line is a JSON object, last line has the final result
            const lines = streamResponse.trim().split("\n").filter(Boolean);
            const lastLine = JSON.parse(lines[lines.length - 1]);

            if (lastLine.status === "error") {
                throw new Error(lastLine.detail || "Agencia processing error");
            }

            const result = lastLine.message;

            if (result?.detail) {
                return { stream: result.detail, json: {} };
            }

            if (result?.messages) {
                const report = JSON.parse(result.messages);
                return { stream: streamResponse, json: { messages: report } };
            }

            return { stream: streamResponse, json: { messages: {} } };
        } catch (error) {
            throw new Error(`"Agencia's server error": ${error}`);
        }
    }
}

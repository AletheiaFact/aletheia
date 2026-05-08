import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { BaseRequest } from "../types";
import { REQUEST } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

export interface AgenciaResponse {
    stream: string;
    json: any;
    executionId?: string;
}

@Injectable({ scope: Scope.REQUEST })
export class AutomatedFactCheckingService {
    agenciaURL: string;
    private readonly logger = new Logger("AutomatedFactCheckingService");

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {
        this.agenciaURL = this.configService.get<string>("automatedFactCheckingAPIUrl") ?? "";
    }

    private getAgenciaToken(): string {
        const { access_token } = this.configService.get("agencia");
        return this.jwtService.sign(
            { sub: this.req.user._id },
            { secret: access_token, expiresIn: "15m" }
        );
    }

    async getResponseFromAgents(
        data,
        sessionId?: string
    ): Promise<AgenciaResponse> {
        try {
            const agenciaAccessToken = this.getAgenciaToken();

            const params: any = {
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

            // Include session_id at top level if provided
            if (sessionId) {
                params.session_id = sessionId;
            }

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

            if (!response.body) {
                throw new Error("Agencia response body is null");
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let streamResponse = "";
            let done, value;

            while (!done) {
                ({ done, value } = await reader.read());
                streamResponse += decoder.decode(value, { stream: true });
            }

            // Parse NDJSON: each line is a JSON object
            const lines = streamResponse.trim().split("\n").filter(Boolean);

            // Extract execution_id from the "started" line (first line)
            let executionId: string | undefined;
            const firstLine = JSON.parse(lines[0]);
            if (firstLine.status === "started" && firstLine.execution_id) {
                executionId = firstLine.execution_id;
                this.logger.log(
                    `Agencia execution started: ${executionId}`
                );
            }

            // Last line has the final result
            const lastLine = JSON.parse(lines[lines.length - 1]);

            if (lastLine.status === "error") {
                throw new Error(lastLine.detail || "Agencia processing error");
            }

            const result = lastLine.message;

            if (result?.detail) {
                return { stream: result.detail, json: {}, executionId };
            }

            if (result?.messages) {
                const report = JSON.parse(result.messages);
                return {
                    stream: streamResponse,
                    json: { messages: report },
                    executionId,
                };
            }

            return {
                stream: streamResponse,
                json: { messages: {} },
                executionId,
            };
        } catch (error) {
            throw new Error(`"Agencia's server error": ${error}`);
        }
    }

    private validateSessionId(sessionId: string): void {
        // Allow only a safe subset of characters for session identifiers.
        // Adjust this regex to match the actual expected format if needed.
        const SESSION_ID_REGEX = /^[A-Za-z0-9_-]+$/;
        if (
            typeof sessionId !== "string" ||
            sessionId.length === 0 ||
            sessionId.length > 256 ||
            !SESSION_ID_REGEX.test(sessionId)
        ) {
            throw new Error("Invalid sessionId");
        }
    }

    private validateExecutionId(executionId: string): void {
        // Allow only a safe subset of characters for execution identifiers.
        const EXECUTION_ID_REGEX = /^[A-Za-z0-9_-]+$/;
        if (
            typeof executionId !== "string" ||
            executionId.length === 0 ||
            executionId.length > 256 ||
            !EXECUTION_ID_REGEX.test(executionId)
        ) {
            throw new Error("Invalid executionId");
        }
    }

    /**
     * List all executions for a given session.
     * Calls GET /executions/{session_id} on Agencia.
     */
    async getExecutions(sessionId: string): Promise<any> {
        try {
            this.validateSessionId(sessionId);
            const safeSessionId = encodeURIComponent(sessionId);
            const agenciaAccessToken = this.getAgenciaToken();

            const response = await fetch(
                `${this.agenciaURL}/executions/${safeSessionId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${agenciaAccessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(
                    `Agencia returned HTTP ${response.status}: ${errorBody.substring(0, 200)}`
                );
            }

            return await response.json();
        } catch (error) {
            this.logger.error(
                `Failed to fetch executions for session ${sessionId}: ${error}`
            );
            throw new Error(`"Agencia's server error": ${error}`);
        }
    }

    /**
     * Get a specific execution by session and execution ID.
     * Calls GET /executions/{session_id}/{execution_id} on Agencia.
     */
    async getExecution(
        sessionId: string,
        executionId: string
    ): Promise<any> {
        try {
            this.validateSessionId(sessionId);
            this.validateExecutionId(executionId);
            const safeSessionId = encodeURIComponent(sessionId);
            const safeExecutionId = encodeURIComponent(executionId);
            const agenciaAccessToken = this.getAgenciaToken();

            const response = await fetch(
                `${this.agenciaURL}/executions/${safeSessionId}/${safeExecutionId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${agenciaAccessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(
                    `Agencia returned HTTP ${response.status}: ${errorBody.substring(0, 200)}`
                );
            }

            return await response.json();
        } catch (error) {
            this.logger.error(
                `Failed to fetch execution ${executionId}: ${error}`
            );
            throw new Error(`"Agencia's server error": ${error}`);
        }
    }
}

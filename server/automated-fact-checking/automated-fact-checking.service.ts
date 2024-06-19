import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable({ scope: Scope.REQUEST })
export class AutomatedFactCheckingService {
    agenciaURL: string;

    constructor(private configService: ConfigService) {
        this.agenciaURL = this.configService.get<string>(
            "automatedFactCheckingAPIUrl"
        );
    }

    async getResponseFromAgents(data): Promise<{ stream: string; json: any }> {
        const params = {
            input: {
                claim: data.claim,
                context: data.context,
                language: "Portuguese",
                messages: [],
                questions: [],
                can_be_fact_checked: false,
            },
        };
        const response = await fetch(`${this.agenciaURL}/stream`, {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
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

        const jsonEvents = streamResponse
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => JSON.parse(line.substring(5)))
            .reduce((acc, data) => ({ ...acc, ...data }), {});

        if (jsonEvents.start_fact_checking) {
            const report = JSON.parse(jsonEvents.start_fact_checking.messages);
            return { stream: streamResponse, json: { messages: report } };
        }

        const report = JSON.parse(jsonEvents.create_report.messages);

        return { stream: streamResponse, json: { messages: report } };
    }
}

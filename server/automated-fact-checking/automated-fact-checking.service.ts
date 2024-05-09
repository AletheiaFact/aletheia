import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable({ scope: Scope.REQUEST })
export class AutomatedFactCheckingService {
    constructor(private configService: ConfigService) {}

    async getResponseFromAgents(data) {
        const params = {
            input: {
                claim: data.claim,
                context: data.context,
                can_be_fact_checked: false,
                messages: [],
                language: "Portuguese",
            },
        };
        const response = await fetch("http://localhost:8000/stream", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
            },
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

        jsonEvents.__end__.messages = JSON.parse(jsonEvents.__end__.messages);

        return { stream: streamResponse, json: jsonEvents.__end__ };
    }
}

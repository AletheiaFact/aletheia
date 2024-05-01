import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable({ scope: Scope.REQUEST })
export class AutomatedFactCheckingService {
    constructor(private configService: ConfigService) {}

    async getResponseFromAgents(sentence: string = ""): Promise<object> {
        try {
            const url = `${this.configService.get<string>("agentsUrl")}/stream`;
            const params = {
                input: {
                    messages: [
                        {
                            content: sentence,
                            type: "human",
                            role: "human",
                        },
                    ],
                    sender: "Supervisor",
                },
            };

            const response = await fetch(url, {
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

            jsonEvents.__end__.messages = this.convertMessageContentsToJSON(
                jsonEvents.__end__.messages
            );
            return jsonEvents.__end__;
        } catch (error) {
            return {
                error: "Error in data fetching process",
            };
        }
    }

    convertMessageContentsToJSON(messages) {
        return messages
            .map(({ content }) => {
                try {
                    return JSON.parse(content);
                } catch (error) {
                    return undefined;
                }
            })
            .filter((message) => message !== undefined);
    }
}

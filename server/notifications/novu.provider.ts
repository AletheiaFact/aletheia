import { Provider, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Novu } from "@novu/node";

const NOVU_PROVIDER_TOKEN = "NOVU_PROVIDER_TOKEN";

export const NovuProvider: Provider = {
    provide: NOVU_PROVIDER_TOKEN,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>("novu.api_key");
        if (!apiKey) {
            // Return null if no API key is configured
            // This allows the app to run without Novu in local environments
            return null;
        }
        return new Novu(apiKey);
    },
};

export const InjectNovu = () => Inject(NOVU_PROVIDER_TOKEN);

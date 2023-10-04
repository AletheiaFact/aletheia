import { Provider, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Novu } from "@novu/node";

const NOVU_PROVIDER_TOKEN = "NOVU_PROVIDER_TOKEN";

export const NovuProvider: Provider = {
    provide: NOVU_PROVIDER_TOKEN,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return new Novu(configService.get<string>("novu.api_key"));
    },
};

export const InjectNovu = () => Inject(NOVU_PROVIDER_TOKEN);

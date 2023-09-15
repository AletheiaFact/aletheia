import { Provider, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Novu } from "@novu/node";

const NOVU_PROVIDER_TOKEN = "NOVU_PROVIDER_TOKEN";

export const NovuProvider: Provider = {
    provide: NOVU_PROVIDER_TOKEN,
    inject: [ConfigService],
    useFactory: () => {
        const NOVU_API_KEY = process.env.NOVU_API_KEY;
        return new Novu(NOVU_API_KEY);
    },
};

export const InjectNovu = () => Inject(NOVU_PROVIDER_TOKEN);

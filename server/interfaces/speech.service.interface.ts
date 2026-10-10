import type { ISpeech } from "./claim-content.interface";

export type ISpeechService = {
    create(speechBody: Record<string, any>): Promise<ISpeech>;
    getSpeech(id: string): Promise<ISpeech | null>;
};

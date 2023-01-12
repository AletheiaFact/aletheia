import { ContentModelEnum } from "./enums";
import { Image } from "./Image";
import { Personality } from "./Personality";

export type Claim = {
    title: string;
    content: Image | string;
    date?: string;
    contentModel: ContentModelEnum;
    sources?: string[];
    personality?: Personality[];
    recaptcha?: string;
};

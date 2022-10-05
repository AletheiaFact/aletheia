import { ContentModelEnum } from "./enums";
import { Image } from "./Image";
import { Personality } from "./Personality";
import { Speech } from "./Speech";

export type Claim = {
    title: string;
    content: Image | Speech;
    date: string;
    contentModel: ContentModelEnum;
    sources: string[];
    personality?: Personality;
};

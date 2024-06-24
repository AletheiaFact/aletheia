import { ContentModelEnum } from "./enums";
import { Group } from "./Group";
import { Image } from "./Image";
import { NameSpaceEnum } from "./Namespace";
import { Personality } from "./Personality";

export type Claim = {
    title: string;
    content: Image | string;
    date?: string;
    contentModel: ContentModelEnum;
    sources?: string[];
    personalities?: Personality[];
    recaptcha?: string;
    nameSpace?: NameSpaceEnum;
    group: Group;
};

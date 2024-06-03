import { NameSpaceEnum } from "../types/Namespace";
import { ContentModelEnum } from "../types/enums";

export const generateSentenceContentPath = (
    nameSpace,
    personality,
    claim,
    contentModel,
    data_hash = null
) => {
    const isSpeech = contentModel === ContentModelEnum.Speech;
    const isImage = contentModel === ContentModelEnum.Image;
    const isDebate = contentModel === ContentModelEnum.Debate;

    const basePath = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";
    let path = `${basePath}/claim/${
        claim.contentModel === ContentModelEnum.Debate ? claim._id : claim?.slug
    }`;

    if (isSpeech || (isImage && personality)) {
        path = `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}`;
    }

    if (isDebate) {
        path += "/debate";
    }

    if (data_hash) {
        path += isImage ? `/image/${data_hash}` : `/sentence/${data_hash}`;
    }

    return path;
};

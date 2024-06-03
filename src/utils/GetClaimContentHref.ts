import { NameSpaceEnum } from "../types/Namespace";
import { ContentModelEnum } from "../types/enums";

export const generateClaimContentPath = (
    nameSpace,
    personality,
    claim,
    contentModel,
    data_hash
) => {
    const basePath = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    switch (contentModel) {
        case ContentModelEnum.Speech:
            return `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}/sentence/${data_hash}`;
        case ContentModelEnum.Image:
            return `${basePath}${
                personality ? `/personality/${personality?.slug}` : ""
            }/claim/${claim?.slug}/image/${data_hash}`;
        case ContentModelEnum.Debate:
            return `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}/sentence/${data_hash}`;
        case ContentModelEnum.Unattributed:
            return `${basePath}/claim/${claim?.slug}/sentence/${data_hash}`;
        default:
            return "";
    }
};

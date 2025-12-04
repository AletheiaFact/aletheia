import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";
import { NameSpaceEnum } from "../types/Namespace";
import { ContentModelEnum, TargetModel } from "../types/enums";

interface Personality {
    slug: string;
}

interface Claim {
    _id: string;
    slug: string;
}

export const generateReviewContentPath = (
    nameSpace: NameSpaceEnum,
    personality: Personality | null | undefined,
    claim: Claim | null | undefined,
    contentModel: ContentModelEnum,
    data_hash: string,
    reviewTaskType, //TODO: Track reviewTaskType params to properly type this param
    targetModel?: TargetModel,
): string => {
    const basePath = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    if (reviewTaskType === ReviewTaskTypeEnum.Source) {
        return `${basePath}/source/${data_hash}`;
    }

    if (reviewTaskType === ReviewTaskTypeEnum.VerificationRequest) {
        return `${basePath}/verification-request/${data_hash}`;
    }

    if (targetModel === TargetModel.History) {
        return `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}/sentence/${data_hash}/history`;
    }

    switch (contentModel) {
        case ContentModelEnum.Speech:
            return `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}/sentence/${data_hash}`;
        case ContentModelEnum.Image:
            return `${basePath}${
                personality
                    ? `/personality/${personality?.slug}/claim/${claim?.slug}`
                    : `/claim/${claim?._id}`
            }/image/${data_hash}`;
        case ContentModelEnum.Debate:
            return `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}/sentence/${data_hash}`;
        case ContentModelEnum.Unattributed:
            return `${basePath}/claim/${claim?.slug}/sentence/${data_hash}`;
        default:
            return "";
    }
};

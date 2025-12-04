import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";
import { NameSpaceEnum } from "../types/Namespace";
import { ContentModelEnum, TargetModel } from "../types/enums";

export const generateReviewContentPath = (
    nameSpace,
    personality,
    claim,
    contentModel,
    data_hash,
    reviewTaskType,
    targetModel?
) => {
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

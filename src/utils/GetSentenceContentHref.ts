import { NameSpaceEnum } from "../types/Namespace";
import { ContentModelEnum } from "../types/enums";

export const generateSentenceContentPath = (
    nameSpace,
    personality,
    claim,
    contentModel,
    data_hash = null
) => {
    const basePath = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    let path = "";

    if (contentModel === ContentModelEnum.Debate && !data_hash) {
        return `${basePath}/claim/${claim?._id || claim?.claimId}/debate`;
    }

    if (contentModel === ContentModelEnum.Image) {
        if (personality) {
            const path = `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}`;
            return data_hash ? `${path}/image/${data_hash}` : path;
        }

        // NOTE: This conditional is necessary because the routing was built to require the claim ID
        // when a data_hash is present, but the slug when it is not.
        // Standardizing this behavior is currently out of scope, so the logic must be maintained.
        if (data_hash) {
            return `${basePath}/claim/${claim?._id}/image/${data_hash}`;
        } else {
            return `${basePath}/claim/${claim?.slug}`;
        }
    }

    if (contentModel === ContentModelEnum.Speech) {
        path = `${basePath}/personality/${personality?.slug}/claim/${claim?.slug}`;

        return data_hash ? `${path}/sentence/${data_hash}` : path;
    }

    path = `${basePath}/claim/${claim?.slug}`;

    return data_hash ? `${path}/sentence/${data_hash}` : path;
};

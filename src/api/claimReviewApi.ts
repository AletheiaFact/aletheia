import { MessageManager } from "../components/Messages";
import { NameSpaceEnum } from "../types/Namespace";
import type { Review } from "../types/Review";
import type { PaginatedResponse, TranslationFn } from "../types/ApiResponse";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/review");

interface FetchOptions {
    page?: number;
    order?: "asc" | "desc";
    pageSize?: number;
    isHidden?: boolean;
    latest?: boolean;
    nameSpace?: NameSpaceEnum;
    mainTopicId?: string;
    q?: string;
    personality?: string;
    contentModel?: string[];
    classification?: string[];
    classificationMethodology?: string;
    startDate?: string;
    endDate?: string;
    withCounts?: boolean;
}

const get = (
    options: FetchOptions = {}
): Promise<PaginatedResponse<Review> | void> => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        isHidden: options?.isHidden || false,
        latest: options?.latest,
        nameSpace: options?.nameSpace || NameSpaceEnum.Main,
        mainTopicId: options?.mainTopicId,
        q: options.q,
        personality: options.personality,
        contentModel: options.contentModel,
        classification: options.classification,
        classificationMethodology: options.classificationMethodology,
        startDate: options.startDate,
        endDate: options.endDate,
        withCounts: options.withCounts,
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const { totalPages, totalReviews, reviews, contentModelCounts } =
                response.data;

            return {
                data: reviews,
                total: totalReviews,
                totalPages,
                contentModelCounts,
            };
        })
        .catch();
};

const updateClaimReviewHiddenStatus = (
    id: string,
    isHidden: boolean,
    t: TranslationFn,
    recaptcha: string,
    description = ""
): Promise<Review> => {
    return request
        .put(`/${id}`, { isHidden, description, recaptcha })
        .then((response) => {
            MessageManager.showMessage(
                "success",
                t(`claimReview:${isHidden ? "hideSuccess" : "unhideSuccess"}`)
            );
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t(`claimReview:${isHidden ? "hideError" : "unhideError"}`)
            );
            throw err;
        });
};

const deleteClaimReview = (id: string, t: TranslationFn): Promise<void> => {
    return request
        .delete(`/${id}`)
        .then(() => {
            MessageManager.showMessage("success", t("claim:deleteSuccess"));
        })
        .catch((err) => {
            console.error(err);
            MessageManager.showMessage("error", t("claim:deleteError"));
        });
};

const getClaimReviewByHash = (dataHash: string): Promise<Review> => {
    return request
        .get(`/${dataHash}`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const ClaimReviewApi = {
    get,
    updateClaimReviewHiddenStatus,
    getClaimReviewByHash,
    deleteClaimReview,
};
export default ClaimReviewApi;

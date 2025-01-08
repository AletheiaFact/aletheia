import global from "../components/Messages";
import axios from "axios";
import { NameSpaceEnum } from "../types/Namespace";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api`,
});

interface FetchOptions {
    page?: number;
    order?: "asc" | "desc";
    pageSize?: number;
    isHidden?: boolean;
    latest?: boolean;
    nameSpace?: NameSpaceEnum;
}

const get = (options: FetchOptions = {}) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        isHidden: options?.isHidden || false,
        latest: options?.latest,
        nameSpace: options?.nameSpace || NameSpaceEnum.Main,
    };

    return request
        .get(`/review`, { params })
        .then((response) => {
            const { totalPages, totalReviews, reviews } = response.data;

            return {
                data: reviews,
                total: totalReviews,
                totalPages,
            };
        })
        .catch();
};

const updateClaimReviewHiddenStatus = (
    id,
    isHidden,
    t,
    recaptcha,
    description = ""
) => {
    return request
        .put(`/review/${id}`, { isHidden, description, recaptcha })
        .then((response) => {
            global.showMessage("success", 
                t(`claimReview:${isHidden ? "hideSuccess" : "unhideSuccess"}`)
            );
            return response.data;
        })
        .catch((err) => {
           global.showMessage("error",
                t(`claimReview:${isHidden ? "hideError" : "unhideError"}`)
            );
            throw err;
        });
};

const deleteClaimReview = (id: string, t: any) => {
    return request
        .delete(`/review/${id}`)
        .then(() => {
            global.showMessage("success", t("claim:deleteSuccess"));
        })
        .catch((err) => {
            console.error(err);
           global.showMessage("error",t("claim:deleteError"));
        });
};

const getClaimReviewByHash = (dataHash) => {
    return request
        .get(`/review/${dataHash}`)
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

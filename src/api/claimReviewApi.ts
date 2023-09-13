import { message } from "antd";
import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api`,
});

const getLatestReviews = () => {
    return request
        .get("/latest-reviews")
        .then((response) => {
            return response.data;
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
            message.success(
                t(`claimReview:${isHidden ? "hideSuccess" : "unhideSuccess"}`)
            );
            return response.data;
        })
        .catch((err) => {
            message.error(
                t(`claimReview:${isHidden ? "hideError" : "unhideError"}`)
            );
            throw err;
        });
};

const deleteClaimReview = (id: string, recaptcha, t: any) => {
    return request
        .delete(`/review/${id}`, { data: recaptcha })
        .then(() => {
            message.success(t("claim:deleteSuccess"));
        })
        .catch((err) => {
            console.error(err);
            message.error(t("claim:deleteError"));
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
    getLatestReviews,
    updateClaimReviewHiddenStatus,
    getClaimReviewByHash,
    deleteClaimReview,
};
export default ClaimReviewApi;

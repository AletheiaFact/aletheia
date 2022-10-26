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

const hideReview = (sentence_hash, hide, t, recaptcha, description = "") => {
    return request
        .put(`/review/${sentence_hash}`, { hide, description, recaptcha })
        .then((response) => {
            message.success(
                t(`claimReview:${hide ? "reviewHidded" : "reviewUnhidded"}`)
            );
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const getClaimReviewBySentenceHash = (sentenceHash) => {
    return request
        .get(`/review/${sentenceHash}`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const ClaimReviewApi = {
    getLatestReviews,
    hideReview,
    getClaimReviewByHash: getClaimReviewBySentenceHash,
};
export default ClaimReviewApi;

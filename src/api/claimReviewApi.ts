import axios from "axios";
import { message } from "antd";

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

const hideReview = (
    sentence_hash,
    hide,
    t,
    description = "",
    recaptcha = ""
) => {
    return request
        .put(`/${sentence_hash}`, { hide, description, recaptcha })
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

const ClaimReviewApi = { getLatestReviews, hideReview };
export default ClaimReviewApi;

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

const ClaimReviewApi = { getLatestReviews };
export default ClaimReviewApi;

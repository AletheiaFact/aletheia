import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimReview`,
});

const save = (review, t) => {
    return request
        .post("/", review)
        .then((response) => {
            message.success(t("claimReviewForm:successMessage"));
            return {
                success: true,
                data: response.data,
            };
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                console.log(err);
            }
            // TODO: Track unknow errors
            const { data } = response;
            message.error(
                data && data.message
                    ? data.message
                    : t("claimReviewForm:errorMessage")
            );
            return {
                success: false,
                data,
            };
        });
};

export default {
    save,
};

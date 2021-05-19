import axios from "axios";
import { message } from "antd";

const baseUrl = `${process.env.API_URL}/claimReview`;

const save = (review = {}, t) => {
    return axios
        .post(`${baseUrl}`, review, { withCredentials: true })
        .then(response => {
            message.success(t("claimReviewForm:successMessage"));
            return {
                success: true,
                data: response.data
            };
        })
        .catch(err => {
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
                data
            };
        });
};

export default {
    save
};

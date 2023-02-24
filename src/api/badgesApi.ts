import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/badge`,
});

const createBadge = (badge, t) => {
    return request
        .post(`/`, badge)
        .then((response) => {
            message.success(t("badges:badgeSaved"));
            return response;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const BadgesApi = {
    createBadge,
};

export default BadgesApi;

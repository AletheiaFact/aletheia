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
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const updateBadge = (badge, users, t) => {
    return request
        .put(`/${badge._id}`, { ...badge, users })
        .then((response) => {
            message.success(t("badges:badgeSaved"));
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const getBadges = () => {
    return request
        .get(`/`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const BadgesApi = {
    createBadge,
    updateBadge,
    getBadges,
};

export default BadgesApi;

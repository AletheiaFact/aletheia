import axios from "axios";
import global from "../components/Messages";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/badge`,
});

const createBadge = (badge, users, t) => {
    return request
        .post(`/`, { ...badge, users })
        .then((response) => {
            global.showMessage("success", `${t("badges:badgeSaved")}`);
            return response.data;
        })
        .catch((err) => {
            global.showMessage("error", err.response.data?.message);
            throw err;
        });
};

const updateBadge = (badge, users, t) => {
    return request
        .put(`/${badge._id}`, { ...badge, users })
        .then((response) => {
            global.showMessage("success", `${t("badges:badgeSaved")}`);
            return response.data;
        })
        .catch((err) => {
            global.showMessage("error", err.response.data?.message);
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
            global.showMessage("error", err.response.data?.message);
            throw err;
        });
};

const BadgesApi = {
    createBadge,
    updateBadge,
    getBadges,
};

export default BadgesApi;

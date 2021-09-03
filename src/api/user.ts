import axios from "axios";
import { message } from "antd";

const baseUrl = `${process.env.API_URL}/user`;

const getById = (id, params = {}) => {
    return axios
        .get(`${baseUrl}/${id}`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            message.error("Error while fetching User");
        });
};

const login = (params, t) => {
    return axios
        .post(`${baseUrl}/signin`, { ...params }, { withCredentials: true })
        .then((response) => {
            return { login: true, ...response };
        })
        .catch((e) => {
            const response = e?.response?.data || {
                message: t("login:failedMessage"),
            };
            return { login: false, ...response };
        });
};

const validateSession = (params, t) => {
    return axios
        .get(`${baseUrl}/validate`, { withCredentials: true })
        .then((response) => {
            return { login: true, ...response };
        })
        .catch((e) => {
            const response = e?.response?.data || {
                message: t("login:failedMessage"),
            };
            return { login: false, ...response };
        });
};

const updatePassword = (params, t) => {
    return axios
        .put(
            `${baseUrl}/${params.userId}/password`,
            { ...params },
            { withCredentials: true }
        )
        .then((response) => {
            return response?.data;
        })
        .catch((e) => {
            return e?.response?.data;
        });
};

export default {
    login,
    validateSession,
    updatePassword,
    getById,
};

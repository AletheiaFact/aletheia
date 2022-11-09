import axios from "axios";
import { message } from "antd";
import { Roles } from "../types/enums";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/user`,
});

const getById = (id, params = {}) => {
    return request
        .get(`/${id}`, {
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
    return request
        .post(`/signin`, { ...params }, { withCredentials: true })
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
    return request
        .put(
            `/${params.userId}/password`,
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

const getUsers = (
    params: {
        searchName: string;
        filterOutRoles?: Roles[];
    },
    t
) => {
    return request
        .get(`/`, { params })
        .then((response) => {
            return response?.data;
        })
        .catch((e) => {
            return (
                e?.response?.data || {
                    message: t("login:getUsersFailed"),
                }
            );
        });
};

const register = (params, t) => {
    return request
        .post(`/register`, { ...params })
        .then((response) => {
            message.success(t("login:signupSuccessfulMessage"));
            return response?.data;
        })
        .catch((e) => {
            if (e.response?.status === 409) {
                message.error(t("login:userAlreadyExists"));
            } else {
                message.error(t("login:signupFailedMessage"));
            }
            return e?.response?.data;
        });
};

const usersApi = {
    login,
    updatePassword,
    getById,
    getUsers,
    register,
};

export default usersApi;

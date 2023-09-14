import axios from "axios";
import { message } from "antd";
import { Roles, Status } from "../types/enums";
import { Badge } from "../types/Badge";

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

const updatePassword = () => {
    return request
        .put(`password-change`)
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

const updateTotp = (
    userId,
    params: {
        totp: boolean;
    }
) => {
    return request
        .put(`/${userId}`, params)
        .then((response) => {
            return response?.data;
        })
        .catch((e) => {
            return e?.response?.data;
        });
};

const update = (
    userId,
    params: {
        role?: Roles;
        badges?: Badge[];
        state?: Status;
    },
    t
) => {
    return request
        .put(`/${userId}`, params)
        .then((response) => {
            message.success(t("admin:roleUpdated"));
            return response?.data;
        })
        .catch((e) => {
            message.error(t("admin:roleUpdateFailed"));
            return e?.response?.data;
        });
};

const userApi = {
    updatePassword,
    updateTotp,
    getById,
    getUsers,
    register,
    update,
};

export default userApi;

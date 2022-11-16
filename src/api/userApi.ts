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

const updateRole = (params: { userId: string; role: string }, t) => {
    return request
        .put(`/update-role`, { role: params.role, id: params.userId })
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
    getById,
    getUsers,
    register,
    updateRole,
};

export default userApi;

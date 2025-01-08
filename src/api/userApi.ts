import axios from "axios";
import global from "../components/Messages";
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
            global.showMessage("error", "Error while fetching User");
        });
};

const getByOryId = (id) => {
    return request
        .get(`/ory/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            global.showMessage("error", "Error while fetching User");
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
        nameSpaceSlug: string;
        canAssignUsers: boolean;
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
            global.showMessage("success", t("login:signupSuccessfulMessage"));
            return response?.data;
        })
        .catch((e) => {
            if (e.response?.status === 409) {
                global.showMessage("error", t("login:userAlreadyExists"));
            } else {
                global.showMessage("error", t("login:signupFailedMessage"));
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
            global.showMessage("success", t("admin:roleUpdated"));
            return response?.data;
        })
        .catch((e) => {
            global.showMessage("error", t("admin:roleUpdateFailed"));
            return e?.response?.data;
        });
};

const userApi = {
    updatePassword,
    updateTotp,
    getById,
    getByOryId,
    getUsers,
    register,
    update,
};

export default userApi;

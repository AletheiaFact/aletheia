import { MessageManager } from "../components/Messages";
import { Roles, Status } from "../types/enums";
import { Badge } from "../types/Badge";
import type { User } from "../types/User";
import type {
    TranslationFn,
    PasswordChangeResponse,
} from "../types/ApiResponse";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/user");

const getById = (id: string, params = {}): Promise<User | void> => {
    return request
        .get(`/${id}`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            MessageManager.showMessage("error", "Error while fetching User");
        });
};

const getByOryId = (id: string): Promise<User | void> => {
    return request
        .get(`/ory/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            MessageManager.showMessage("error", "Error while fetching User");
        });
};

const updatePassword = (): Promise<PasswordChangeResponse> => {
    return request
        // TODO: missing leading slash — should be `/password-change`, verify endpoint before fixing
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
    t: TranslationFn
): Promise<User[]> => {
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

const register = (
    params: Record<string, unknown>,
    t: TranslationFn
): Promise<User | undefined> => {
    return request
        .post(`/register`, { ...params })
        .then((response) => {
            MessageManager.showMessage(
                "success",
                t("login:signupSuccessfulMessage")
            );
            return response?.data;
        })
        .catch((e) => {
            if (e.response?.status === 409) {
                MessageManager.showMessage(
                    "error",
                    t("login:userAlreadyExists")
                );
            } else {
                MessageManager.showMessage(
                    "error",
                    t("login:signupFailedMessage")
                );
            }
            return e?.response?.data;
        });
};

const updateTotp = (
    userId: string,
    params: {
        totp: boolean;
    }
): Promise<User | undefined> => {
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
    userId: string,
    params: {
        role?: Roles;
        badges?: Badge[];
        state?: Status;
    },
    t: TranslationFn
): Promise<User | undefined> => {
    return request
        .put(`/${userId}`, params)
        .then((response) => {
            MessageManager.showMessage("success", t("admin:roleUpdated"));
            return response?.data;
        })
        .catch((e) => {
            MessageManager.showMessage("error", t("admin:roleUpdateFailed"));
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

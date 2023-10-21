import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claim`,
});

interface FetchOptions {
    page?: number;
    order?: "asc" | "desc";
    pageSize?: number;
    isHidden?: boolean;
    nameSpace?: string;
    personality: string;
    i18n?: { languages?: any };
    fetchOnly?: boolean;
}

const get = (options: FetchOptions) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        personality: options.personality,
        language: options?.i18n?.languages[0],
        isHidden: options?.isHidden || false,
        nameSpace: options?.nameSpace || "aletheia",
    };

    return request
        .get("/", { params })
        .then((response) => {
            const { claims, totalPages, totalClaims } = response.data;
            if (options.fetchOnly) {
                return {
                    data: claims,
                    total: totalClaims,
                    totalPages,
                };
            }
        })
        .catch((e) => {
            throw e;
        });
};

const getById = (id, t, params = {}) => {
    return request
        .get(`${id}`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            message.error(t("claim:errorWhileFetching"));
        });
};

const saveSpeech = (t, claim = {}) => {
    return request
        .post("/", claim)
        .then((response) => {
            const { title } = response.data;
            message.success(
                `"${title}" ${t("claimForm:successCreateMessage")}`
            );
            return response.data;
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track errors with Sentry
            }
            const { data } = response;
            message.error(
                data && data.message
                    ? data.message
                    : t("claimForm:errorCreateMessage")
            );
        });
};

const saveImage = (t, claimImage = {}) => {
    return request
        .post("/image", claimImage)
        .then((response) => {
            const { title } = response.data;
            message.success(
                `"${title}" ${t("claimForm:successCreateMessage")}`
            );
            return response.data;
        })
        .catch((err) => {
            const response = err && err.response;
            message.error(
                response?.data && response?.data.message
                    ? response?.data.message
                    : t("claimForm:errorCreateMessage")
            );
        });
};

const saveDebate = (t, debate = {}) => {
    return request
        .post("/debate", debate)
        .then((response) => {
            const { title } = response.data;
            message.success(
                `"${title}" ${t("claimForm:successCreateMessage")}`
            );
            return response.data;
        })
        .catch((err) => {
            const response = err && err.response;
            // TODO: Track errors with Sentry
            if (!response) {
                console.error(err);
            }
        });
};

const updateDebate = (
    debateId,
    t,
    params: { content: string; personality: string; isLive: boolean }
) => {
    return request
        .put(`/debate/${debateId}`, params)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track errors with Sentry
            }
            const { data } = response;
            message.error(
                data && data.message
                    ? data.message
                    : t("claimForm:errorUpdateMessage")
            );
        });
};

const deleteClaim = (id: string, t: any) => {
    return request
        .delete(`${id}`)
        .then(() => {
            message.success(t("claim:deleteSuccess"));
        })
        .catch((err) => {
            console.error(err);
            message.error(t("claim:deleteError"));
        });
};

const updateClaimHiddenStatus = (
    id: string,
    isHidden: boolean,
    t: any,
    recaptcha: string,
    description: string
) => {
    return request
        .put(`/hidden/${id}`, {
            isHidden,
            recaptcha,
            description,
        })
        .then(() => {
            message.success(
                t(`claim:${isHidden ? "hideSuccess" : "unhideSuccess"}`)
            );
        })
        .catch((err) => {
            console.error(err);
            message.error(t(`claim:${isHidden ? "hideError" : "unhideError"}`));
        });
};

const claimApi = {
    get,
    getById,
    saveSpeech,
    saveImage,
    saveDebate,
    updateDebate,
    deleteClaim,
    updateClaimHiddenStatus,
};
export default claimApi;

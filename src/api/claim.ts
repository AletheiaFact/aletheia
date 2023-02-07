import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claim`,
});

const get = (options) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        name: options.searchName,
        pageSize: options.pageSize ? options.pageSize : 5,
        personality: options.personality,
        language: options?.i18n?.languages[0],
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
    params: { content: string; personality: string }
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

const claimApi = {
    get,
    getById,
    saveSpeech,
    saveImage,
    saveDebate,
    updateDebate,
};
export default claimApi;

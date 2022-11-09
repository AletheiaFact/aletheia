import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claim`,
});

const get = (options = {}) => {
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
        .get(
            `${id}`,
            {
                params,
            },
            { withCredentials: true }
        )
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            message.error(t("claim:errorWhileFetching"));
        });
};

const getClaimSentence = (id, sentenceHash) => {
    return request
        .get(`${id}/sentence/${sentenceHash}`)
        .then((response) => {
            return response?.data;
        })
        .catch((e) => {
            // TODO: use Sentry instead
            // console.log(e);
        });
};

const getClaimSentenceReviews = (options = {}) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        name: options.searchName,
        pageSize: options.pageSize ? options.pageSize : 5,
        personality: options.personality,
        language: options?.i18n?.languages[0],
    };
    return request
        .get(`${options.claimId}/sentence/${options.sentenceHash}/reviews`, {
            params,
        })
        .then((response) => {
            const { reviews, totalPages, totalReviews, userReview } =
                response.data;
            return {
                data: reviews,
                userReview,
                total: totalReviews,
                totalPages,
            };
        })
        .catch((e) => {
            // TODO: use Sentry instead
            // console.log(e);
        });
};

const save = (t, claim = {}) => {
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
                // TODO: Track unknow errors
                // TODO: use Sentry instead
                // console.log(err);
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

const update = (id, t, params = {}) => {
    return request
        .put(`${id}`, params)
        .then((response) => {
            const { title, _id } = response.data;
            message.success(
                `"${title}" ${t("claimForm:successUpdateMessage")}`
            );
            return _id;
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track unknow errors
                // TODO: use Sentry instead
                // console.log(err);
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
    getClaimSentence,
    getClaimSentenceReviews,
    save,
    saveImage,
    update,
};
export default claimApi;

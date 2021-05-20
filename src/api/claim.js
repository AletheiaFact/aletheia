import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `${process.env.API_URL}/claim`
});

const get = (options = {}) => {
    const params = {
        page: options.page - 1,
        name: options.searchName,
        pageSize: options.pageSize,
        personality: options.personality
    };

    return request
        .get("claim", { params })
        .then(response => {
            const { claims, totalPages, totalClaims } = response.data;
            if (options.fetchOnly) {
                return {
                    data: claims,
                    total: totalClaims,
                    totalPages
                };
            }
        })
        .catch(e => {
            throw e;
        });
};

const getById = (id, params = {}) => {
    return request
        .get(
            `${id}`,
            {
                params
            },
            { withCredentials: true }
        )
        .then(response => {
            return response.data;
        })
        .catch(() => {
            message.error("Error while fetching Claim");
        });
};

const getClaimSentence = (id, sentenceHash) => {
    return request
        .get(`${id}/sentence/${sentenceHash}`)
        .then(response => {
            return response?.data;
        })
        .catch(e => {
            console.log(e);
        });
};

const getClaimSentenceReviews = (options = {}) => {
    const params = {
        page: options.page - 1,
        pageSize: options.pageSize
    };
    return request
        .get(`${options.claim}/sentence/${options.sentenceHash}/reviews`, {
            params
        })
        .then(response => {
            const {
                reviews,
                totalPages,
                totalReviews,
                userReview
            } = response.data;
            return {
                data: reviews,
                userReview,
                total: totalReviews,
                totalPages
            };
        })
        .catch(e => {
            console.log(e);
        });
};

const save = (claim = {}) => {
    return request
        .post("/", claim)
        .then(response => {
            const { title, _id } = response.data;
            message.success(`"${title}" created with success`);
            return _id;
        })
        .catch(err => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track unknow errors
                console.log(err);
            }
            const { data } = response;
            message.error(
                data && data.message ? data.message : "Error while saving claim"
            );
        });
};

const update = (id, params = {}) => {
    return request
        .put(`${id}`, params)
        .then(response => {
            const { title, _id } = response.data;
            message.success(`"${title}" updated with success`);
            return _id;
        })
        .catch(err => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track unknow errors
                console.log(err);
            }
            const { data } = response;
            message.error(
                data && data.message
                    ? data.message
                    : "Error while updating claim"
            );
        });
};

export default {
    get,
    getById,
    getClaimSentence,
    getClaimSentenceReviews,
    save,
    update
};

import axios from "axios";
import { NameSpaceEnum } from "../types/Namespace";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/verification-request`,
});

const get = (options) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 10,
        nameSpace: options?.nameSpace || NameSpaceEnum.Main,
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const {
                verificationRequests,
                totalPages,
                totalVerificationRequests,
            } = response.data;

            return {
                data: verificationRequests,
                total: totalVerificationRequests,
                totalPages,
            };
        })
        .catch((err) => {
            console.log(err);
        });
};

const getVerificationRequests = (params) => {
    return request
        .get(`/search`, { params })
        .then((response) => {
            return response?.data;
        })
        .catch((e) => {
            console.error("error while getting verification requests", e);
        });
};

const getById = (id, _t = null, params = {}) => {
    return request
        .get(`/${id}`, { params })
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.error("error while getting verification request", e);
        });
};

const updateVerificationRequest = (id, params) => {
    return request
        .put(`/${id}`, params)
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.error("error while updating verification request", e);
        });
};

const removeVerificationRequestFromGroup = (id, params) => {
    return request
        .put(`/${id}/group`, params)
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            console.error("error while removing verification request", e);
        });
};

const verificationRequestApi = {
    get,
    getVerificationRequests,
    getById,
    updateVerificationRequest,
    removeVerificationRequestFromGroup,
};

export default verificationRequestApi;

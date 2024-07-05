import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/verification-request`,
});

const getVerificationRequests = (params) => {
    return request
        .get(`/`, { params })
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
    getVerificationRequests,
    getById,
    updateVerificationRequest,
    removeVerificationRequestFromGroup,
};

export default verificationRequestApi;

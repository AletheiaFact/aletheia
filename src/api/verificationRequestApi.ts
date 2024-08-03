import axios from "axios";
import { ActionTypes } from "../store/types";
import { message } from "antd";
interface SearchOptions {
    searchText?: string;
    page?: number;
    pageSize?: number;
    order?: string;
}

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/verification-request`,
});

const get = (options: SearchOptions, dispatch = null) => {
    const params = {
        content: options.searchText,
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 10,
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const {
                verificationRequests,
                totalPages,
                totalVerificationRequests,
            } = response.data;

            if (!dispatch) {
                return {
                    data: verificationRequests,
                    total: totalVerificationRequests,
                    totalPages,
                };
            }

            dispatch({
                type: ActionTypes.SEARCH_RESULTS,
                results: verificationRequests,
            });
            dispatch({
                type: ActionTypes.SET_TOTAL_PAGES,
                totalPages,
            });
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

const updateVerificationRequest = (id, params, t) => {
    return request
        .put(`/${id}`, params)
        .then((response) => {
            message.success(
                t("verificationRequest:addVerificationRequestSuccess")
            );
            return response.data;
        })
        .catch((e) => {
            message.error(t("verificationRequest:addVerificationRequestError"));
            console.error("error while updating verification request", e);
        });
};

const removeVerificationRequestFromGroup = (id, params, t) => {
    return request
        .put(`/${id}/group`, params)
        .then((response) => {
            message.success(
                t("verificationRequest:removeVerificationRequestSuccess")
            );
            return response.data;
        })
        .catch((e) => {
            message.error(
                t("verificationRequest:removeVerificationRequestError")
            );
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

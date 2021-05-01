import axios from "axios";
import { message } from "antd";

const baseUrl = `${process.env.API_URL}/claim`;

const get = (options = {}) => {
    const params = {
        page: options.page - 1,
        name: options.searchName,
        pageSize: options.pageSize,
        personality: options.personality
    };

    return axios
        .get(`${process.env.API_URL}/claim`, { params })
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
    return axios
        .get(`${baseUrl}/${id}`, {
            params
        })
        .then(response => {
            return response.data;
        })
        .catch(() => {
            message.error("Error while fetching Personality");
        });
};

const save = (claim = {}) => {
    return axios
        .post(`${baseUrl}`, claim, { withCredentials: true })
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
    return axios
        .put(`${baseUrl}/${id}`, params)
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
    save,
    update
};

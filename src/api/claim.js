import axios from "axios";
import { message } from "antd";

const baseUrl = `${process.env.API_URL}/claim`;

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
        .post(`${baseUrl}`, claim)
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
    axios
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
    getById,
    save,
    update
};

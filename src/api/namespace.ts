import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/name-space`,
});

const createNameSpace = (nameSpace, t) => {
    return request
        .post(`/`, { ...nameSpace })
        .then((response) => {
            message.success(t("namespaces:nameSpaceSaved"));
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const updateNameSpace = (nameSpace, t) => {
    return request
        .put(`/${nameSpace._id}`, { ...nameSpace })
        .then((response) => {
            message.success(t("namespaces:nameSpaceSaved"));
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const getNameSpaces = () => {
    return request
        .get(`/`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const NameSpacesApi = {
    createNameSpace,
    updateNameSpace,
    getNameSpaces,
};

export default NameSpacesApi;

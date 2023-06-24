import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/image`,
});

const getImageTopicsByDatahash = (data_hash) => {
    return request
        .get(`/${data_hash}`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const uploadImage = (files, t) => {
    return request
        .post("/", files)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            message.error(t(`claim:${err.response.data.message}`));
            throw err;
        });
};

const createClaimTypeImage = (file) => {
    return request
        .post("/create", file)
        .then((response) => {
            message.success("upload success");
            return response.data;
        })
        .catch((err) => {
            message.error("upload failed");
            throw err;
        });
};

const deleteImageTopic = (topics, data_hash) => {
    return request
        .put(`/${data_hash}`, topics)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const ImageApi = {
    uploadImage,
    createClaimTypeImage,
    deleteImageTopic,
    getImageTopicsByDatahash,
};

export default ImageApi;

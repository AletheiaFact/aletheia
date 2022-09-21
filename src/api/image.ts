import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/image`,
});

const uploadImage = (files) => {
    return request
        .post("/", files)
        .then((response) => {
            // message.success(t("topics:uploadImageSuccess"));
            console.log("response", response.data);
            return response.data;
        })
        .catch((err) => {
            // message.error(t("topics:uploadImageError"));
            console.log("response error", err);
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
            console.log("response error", err);
            throw err;
        });
};

const ImageApi = {
    uploadImage,
    createClaimTypeImage,
};

export default ImageApi;

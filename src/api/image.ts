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

const ImageApi = {
    uploadImage,
};

export default ImageApi;

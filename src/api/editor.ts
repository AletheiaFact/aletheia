import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/editor`,
});

const update = (reference, editorContentObject, t) => {
    return request
        .put(`${reference}`, { editorContentObject })
        .then((response) => {
            return response;
        })
        .catch((err) => {
            message.error(t(`claim:${err.response.data?.message}`));
            throw err;
        });
};

const EditorApi = {
    update,
};

export default EditorApi;

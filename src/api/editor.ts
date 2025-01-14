import axios from "axios";
import { MessageManager } from "../components/Messages";

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
            MessageManager.showMessage("error", t(`claim:${err.response.data?.message}`));
            throw err;
        });
};

const EditorApi = {
    update,
};

export default EditorApi;

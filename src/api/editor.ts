import { MessageManager } from "../components/Messages";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/editor");

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

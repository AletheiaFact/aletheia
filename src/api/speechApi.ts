import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/speech");

const getById = (speechId) => {
    return request
        .get(`/${speechId}`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const SpeechApi = {
    getById,
};

export default SpeechApi;

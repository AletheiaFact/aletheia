import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/sentence`,
});

const deleteSentenceTopic = (topics, data_hash) => {
    return request
        .put(`/${data_hash}`, topics)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const SentenceApi = {
    deleteSentenceTopic,
};

export default SentenceApi;

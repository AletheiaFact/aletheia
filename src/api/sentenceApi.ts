import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/sentence`,
});

const getSentenceTopicsByDatahash = (data_hash) => {
    return request
        .get(`/${data_hash}`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

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
    getSentenceTopicsByDatahash,
};

export default SentenceApi;

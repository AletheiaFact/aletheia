import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/sentence`,
});

const getSentenceTopicsByDatahash = (data_hash, t) => {
    return request
        .get(`/${data_hash}`)
        .then((response) => {
            message.success(t("topics:createTopicsSuccess"));
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const deleteSentenceTopic = (topics, data_hash, t) => {
    return request
        .put(`/${data_hash}`, topics)
        .then((response) => {
            message.success(t("topics:deleteTopics"));
            return response.data;
        })
        .catch((err) => {
            message.error(t("topics:deleteTopicsError"));
            throw err;
        });
};

const SentenceApi = {
    deleteSentenceTopic,
    getSentenceTopicsByDatahash,
};

export default SentenceApi;

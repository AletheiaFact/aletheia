import axios from "axios";
import { MessageManager } from "../components/Messages";

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

const getSentencesWithCop30Topics = () => {
    return request
        .get("/cop30")
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const getCop30Stats = () => {
    return request.get("/cop30/stats").then((response) => response.data);
};

const deleteSentenceTopic = (topics, data_hash, t) => {
    return request
        .put(`/${data_hash}`, topics)
        .then((response) => {
            MessageManager.showMessage("success", t("topics:deleteTopics"));
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", t("topics:deleteTopicsError"));
            throw err;
        });
};

const SentenceApi = {
    deleteSentenceTopic,
    getSentencesWithCop30Topics,
    getCop30Stats,
    getSentenceTopicsByDatahash,
};

export default SentenceApi;

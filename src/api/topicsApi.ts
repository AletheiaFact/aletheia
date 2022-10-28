import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/topics`,
});

const getTopics = (topicName, t) => {
    const params = {
        topicName,
    };
    return request
        .get(`/`, { params })
        .then((response) => {
            return response?.data;
        })
        .catch((e) => {
            return (
                e?.response?.data || {
                    message: t("login:getTopicsFailed"),
                }
            );
        });
};

const createTopics = (params, t) => {
    return request
        .post("/", { ...params })
        .then((response) => {
            message.success(t("topics:createTopicsSuccess"));
            return response.data;
        })
        .catch((err) => {
            message.error(t("topics:createTopicsError"));
            throw err;
        });
};

const TopicsApi = {
    createTopics,
    getTopics,
};

export default TopicsApi;

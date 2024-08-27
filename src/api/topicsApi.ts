import axios from "axios";
import { message } from "antd";
import { ActionTypes } from "../store/types";

interface IGetTopicsOptions {
    topicName: string;
    t: Function;
    dispatch?: Function;
}

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/topics`,
});

const searchTopics = ({ query, dispatch }) => {
    const params = { query };
    return request
        .get(`/search`, { params })
        .then((response) => {
            const topicResults = response.data;
            dispatch({
                type: ActionTypes.RESULTS_TOPICS_AUTOCOMPLETE,
                results: topicResults,
            });
            return topicResults;
        })
        .catch((e) => {
            message.error("Failed to fetch topics");
            return [];
        });
};

const getTopics = ({ topicName, t, dispatch }: IGetTopicsOptions) => {
    const params = {
        topicName,
    };
    return request
        .get(`/`, { params })
        .then((response) => {
            const topicResults = response.data;
            dispatch({
                type: ActionTypes.RESULTS_TOPICS_AUTOCOMPLETE,
                results: topicResults,
            });
            return topicResults;
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
    searchTopics,
};

export default TopicsApi;

import axios from "axios";
import { MessageManager } from "../components/Messages";
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

const searchTopics = ({ query, limit = 5, language = "pt", dispatch, t }) => {
  const params = { query, limit, language };
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
      MessageManager.showMessage("error", t("topics:getTopicsFailed"));
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
            MessageManager.showMessage("success", t("topics:createTopicsSuccess"));
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", t("topics:createTopicsError"));
            throw err;
        });
};

const TopicsApi = {
    createTopics,
    getTopics,
    searchTopics,
};

export default TopicsApi;

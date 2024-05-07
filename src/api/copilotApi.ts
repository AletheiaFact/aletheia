import axios from "axios";
import { message } from "antd";
import { ActionTypes } from "../store/types";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/langchain-chat`,
});

const agentChat = (params) => {
    return request
        .post("/agent-chat", { ...params })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const copilotApi = {
    agentChat,
};

export default copilotApi;

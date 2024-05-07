import axios from "axios";
import { message } from "antd";
import { ActionTypes } from "../store/types";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/agent-chat`,
});

const agentChat = (params) => {
    console.log("params api", { messages: params });
    return request
        .post("/", { messages: params })
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

import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/agent-chat`,
});

const agentChat = (params) => {
    console.log("params api", params);
    return request
        .post("/", params)
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

import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/agent-chat`,
});

const agentChat = (params) => {
    return request
        .post("/", params)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.error(
                "Error while chatting with Aletheia's Assistant: ",
                err
            );
            return err;
        });
};

const copilotApi = {
    agentChat,
};

export default copilotApi;

import axios from "axios";

const isAuthError = (err: unknown) =>
    axios.isAxiosError(err) && err.response?.status === 403;

const chatRequest = axios.create({
    withCredentials: true,
    baseURL: `/api/agent-chat`,
});

const sessionRequest = axios.create({
    withCredentials: true,
    baseURL: `/api/copilot-session`,
});

const getSession = (claimReviewDataHash: string) => {
    return sessionRequest
        .get("/", { params: { claimReviewDataHash } })
        .then((response) => response.data)
        .catch((err) => {
            if (!isAuthError(err))
                console.error("Error fetching copilot session: ", err);
            throw err;
        });
};

const createSession = (claimReviewDataHash: string, context: object) => {
    return sessionRequest
        .post("/", { claimReviewDataHash, context })
        .then((response) => response.data)
        .catch((err) => {
            if (!isAuthError(err))
                console.error("Error creating copilot session: ", err);
            throw err;
        });
};

const clearSession = (sessionId: string) => {
    return sessionRequest
        .post(`/${sessionId}/clear`)
        .then((response) => response.data)
        .catch((err) => {
            console.error("Error clearing copilot session: ", err);
            throw err;
        });
};

const sendMessage = (sessionId: string, message: string) => {
    return chatRequest
        .post("/", { sessionId, message })
        .then((response) => response.data)
        .catch((err) => {
            console.error(
                "Error while chatting with Aletheia's Assistant: ",
                err
            );
            throw err;
        });
};

const listSessions = (
    page: number = 1,
    pageSize: number = 20,
    claimReviewDataHash?: string
) => {
    return sessionRequest
        .get("/list", { params: { page, pageSize, claimReviewDataHash } })
        .then((response) => response.data)
        .catch((err) => {
            if (!isAuthError(err))
                console.error("Error listing copilot sessions: ", err);
            throw err;
        });
};

const getSessionById = (sessionId: string) => {
    return sessionRequest
        .get(`/${sessionId}/detail`)
        .then((response) => response.data)
        .catch((err) => {
            if (!isAuthError(err))
                console.error("Error fetching copilot session by id: ", err);
            throw err;
        });
};

const updateSession = (
    sessionId: string,
    data: { title?: string; status?: string }
) => {
    return sessionRequest
        .patch(`/${sessionId}`, data)
        .then((response) => response.data)
        .catch((err) => {
            console.error("Error updating copilot session: ", err);
            throw err;
        });
};

const copilotApi = {
    getSession,
    createSession,
    clearSession,
    sendMessage,
    listSessions,
    getSessionById,
    updateSession,
};

export default copilotApi;

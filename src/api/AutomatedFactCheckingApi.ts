import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/ai-fact-checking");

const createReviewTaskUsingAIAgents = (params) => {
    return request
        .post("/", { ...params })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const AutomatedFactCheckingApi = {
    createReviewTaskUsingAIAgents,
};

export default AutomatedFactCheckingApi;

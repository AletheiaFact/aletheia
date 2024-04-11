import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/ai-fact-checking`,
});

const createClaimReviewTaskUsingAIAgents = (params) => {
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
    createClaimReviewTaskUsingAIAgents,
};

export default AutomatedFactCheckingApi;

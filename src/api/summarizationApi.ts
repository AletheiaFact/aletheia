import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/summarization`,
});

const summarizeSource = (source) => {
    return request
        .get("/", { params: { source } })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const SummarizationApi = {
    summarizeSource,
};

export default SummarizationApi;

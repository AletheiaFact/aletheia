import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claim-revision`,
});

const getClaimRevisionsById = (id) => {
    return request
        .get(`/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            console.error("error while fetching");
        });
};

const claimRevisionApi = {
    getClaimRevisionsById,
};

export default claimRevisionApi;

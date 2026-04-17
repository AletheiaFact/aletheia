import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/claim-revision");

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

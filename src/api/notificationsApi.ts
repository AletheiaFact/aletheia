import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/notification`,
});

const sendNotification = (subscriberId, payload) => {
    return request
        .post("/", { subscriberId, payload })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const getTokens = (subscriberId) => {
    return request
        .get(`/token/${subscriberId}`)
        .then((response) => {
            const { hmacHash, applicationIdentifier } = response.data;

            return {
                hmacHash,
                applicationIdentifier,
            };
        })
        .catch((err) => {
            console.error(err);
        });
};

const NotificationsApi = {
    sendNotification,
    getTokens,
};

export default NotificationsApi;

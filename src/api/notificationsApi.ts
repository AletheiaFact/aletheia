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

const sendEmail = (subscriberId, email, description) => {
    return request
        .post("/api/emails", { subscriberId, email, description })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const NotificationsApi = {
    sendEmail,
    sendNotification,
};

export default NotificationsApi;

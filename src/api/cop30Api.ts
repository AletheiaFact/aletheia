import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: "/api/cop30",
});

export const cop30Api = {
    getSentences: () =>
        request.get("/sentences").then((response) => response.data),
};

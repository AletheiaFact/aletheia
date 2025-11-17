import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: "/api/sentences",
});

export const cop30Api = {
    getSentences: () => request.get("/cop30").then((response) => response.data),
};

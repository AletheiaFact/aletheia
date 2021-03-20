import axios from "axios";

const getById = (id, params = {}) => {
    return axios
        .get(`${process.env.API_URL}/claim/${id}`, {
            params
        })
        .then(response => {
            return response.data;
        })
        .catch(() => {
            console.log("Error while fetching Personality");
        });
};

export default {
    getById
};

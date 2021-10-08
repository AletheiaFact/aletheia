import axios from "axios";
import { message } from "antd";
console.log(process.env.API_URL)
const baseUrl = `api/stats`;

const get = (id, params = {}) => {
    return axios
        .get(`${baseUrl}/home`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            message.error("Error while fetching Stats");
        });
};

export default {
    get,
};

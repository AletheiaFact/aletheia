import axios from "axios";

const server = "http://localhost:3000";

const get = (endpoint, id) => {
    let newEndpoint = endpoint;
    if (id !== "") {
        newEndpoint = `${endpoint}/${id}`;
    }

    return axios.get(`${server}${newEndpoint}`).then(res => res.data);
};

const post = (endpoint, body) =>
    axios.post(`${server}${endpoint}`, body).then(res => res.data);

const update = (endpoint, body) =>
    axios.put(`${server}${endpoint}`, body).then(res => res.data);

const remove = (endpoint, id) =>
    axios.delete(`${server}${endpoint}/${id}`).then(res => res.data);

export default {
    get,
    post,
    update,
    remove
};

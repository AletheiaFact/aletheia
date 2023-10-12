import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/comment`,
});

const createComment = (comment) => {
    return request
        .post(`/`, comment)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const updateComments = (comments) => {
    return request
        .patch(`/bulk-update`, comments)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const updateComment = (commentId, comment) => {
    return request
        .put(`/${commentId}`, comment)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            message.error(err.response.data?.message);
            throw err;
        });
};

const CommentApi = {
    createComment,
    updateComments,
    updateComment,
};

export default CommentApi;

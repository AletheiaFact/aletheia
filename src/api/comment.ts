import { MessageManager } from "../components/Messages";
import { createApiInstance } from "./apiFactory";
import { Comment, NewCommentPayload } from "../types/Comment";

const request = createApiInstance("/api/comment");

const createComment = (comment) => {
    return request
        .post(`/`, comment)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", err.response.data?.message);
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
            MessageManager.showMessage("error", err.response.data?.message);
            throw err;
        });
};

const updateComment = (
    commentId: string,
    comment: Partial<Comment>
): Promise<Comment> => {
    return request
        .put(`/${commentId}`, comment)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", err.response.data?.message);
            throw err;
        });
};

const createReplyComment = (
    commentId: string,
    newComment: NewCommentPayload
): Promise<Comment> => {
    return request
        .put(`/${commentId}/create-reply`, newComment)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", err.response.data?.message);
            throw err;
        });
};

const deleteReplyComment = (
    commentId: string,
    replyCommentId: string
): Promise<Comment> => {
    return request
        .put(`/${commentId}/delete-reply`, { replyCommentId })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", err.response.data?.message);
            throw err;
        });
};

const CommentApi = {
    createComment,
    updateComments,
    updateComment,
    createReplyComment,
    deleteReplyComment,
};

export default CommentApi;

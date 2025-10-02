import { MessageManager } from "../components/Messages";
import axios from "axios";
import { NameSpaceEnum } from "../types/Namespace";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/reviewtask`,
});

const getReviewTasks = (options) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        value: options.value,
        filterUser: options.filterUser,
        reviewTaskType: options.reviewTaskType,
        nameSpace: options.nameSpace ? options.nameSpace : NameSpaceEnum.Main,
    };
    return request
        .get(`/`, { params })
        .then((response) => {
            const { tasks, totalPages, totalTasks } = response.data;

            return {
                data: tasks || [],
                total: totalTasks,
                totalPages,
            };
        })
        .catch((e) => {
            throw e;
        });
};

const getMachineByDataHash = (params) => {
    return request
        .get(`/hash/${params}`)
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            // TODO: Track with sentry
        });
};

const createReviewTask = (params, t, type) => {
    return request
        .post("/", { ...params })
        .then((response) => {
            MessageManager.showMessage("success", t(`reviewTask:${type}_SUCCESS`));
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", t(`reviewTask:${type}_ERROR`));
            throw err;
        });
};

const autoSaveDraft = (params, t) => {
    return request
        .put(`/${params.data_hash}`, { ...params })
        .then((response) => {
            MessageManager.showMessage("success", t(`reviewTask:SAVE_DRAFT_SUCCESS`));
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const getEditorContentObject = (data_hash, params) => {
    return request
        .get(`/editor-content/${data_hash}`, { params })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            // TODO: Track with sentry
        });
};

const addComment = (hash, comment) => {
    return request
        .put(`/add-comment/${hash}`, { comment })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const deleteComment = (hash, commentId) => {
    return request
        .put(`/delete-comment/${hash}`, { commentId })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const resetToInitialState = (dataHash, data, t) => {
    return request
        .put(`/${dataHash}/reset`, data)
        .then((response) => {
            MessageManager.showMessage("success", t("reviewTask:RESET_SUCCESS"));
            return response.data;
        })
        .catch((error) => {
            MessageManager.showMessage("error", t("reviewTask:RESET_ERROR"));
            throw error;
        });
};

const ReviewTaskApi = {
    getMachineByDataHash,
    createReviewTask,
    getReviewTasks,
    autoSaveDraft,
    getEditorContentObject,
    addComment,
    deleteComment,
    resetToInitialState,
};

export default ReviewTaskApi;

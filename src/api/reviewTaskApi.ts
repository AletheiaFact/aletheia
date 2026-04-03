import { MessageManager } from "../components/Messages";
import axios from "axios";
import { NameSpaceEnum } from "../types/Namespace";
import type { PaginatedResponse, TranslationFn } from "../types/ApiResponse";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/reviewtask`,
});

interface ReviewTaskOptions {
    page?: number;
    order?: "asc" | "desc";
    pageSize?: number;
    value?: string;
    filterUser?: string;
    reviewTaskType?: string;
    nameSpace?: string;
}

const getReviewTasks = (
    options: ReviewTaskOptions
): Promise<PaginatedResponse<unknown>> => {
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

const getMachineByDataHash = (params: string): Promise<unknown> => {
    return request
        .get(`/hash/${params}`)
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            // TODO: Track with sentry
        });
};

const createReviewTask = (
    params: Record<string, unknown>,
    t: TranslationFn,
    type: string
): Promise<unknown> => {
    return request
        .post("/", { ...params })
        .then((response) => {
            MessageManager.showMessage(
                "success",
                t(`reviewTask:${type}_SUCCESS`)
            );
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage("error", t(`reviewTask:${type}_ERROR`));
            throw err;
        });
};

const autoSaveDraft = (
    params: Record<string, unknown> & { data_hash: string },
    t: TranslationFn
): Promise<unknown> => {
    return request
        .put(`/${params.data_hash}`, { ...params })
        .then((response) => {
            MessageManager.showMessage(
                "success",
                t(`reviewTask:SAVE_DRAFT_SUCCESS`)
            );
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const saveDraft = (
    data_hash: string,
    machine: { context: any },
    t,
    reportModel?: string,
    nameSpace?: string,
    reviewTaskType?: string,
    target?: string
) => {
    return request
        .put(`/save-draft/${data_hash}`, {
            machine,
            reportModel,
            nameSpace,
            reviewTaskType,
            target,
        })
        .then((response) => {
            MessageManager.showMessage(
                "success",
                t(`reviewTask:SAVE_DRAFT_SUCCESS`)
            );
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t(`reviewTask:SAVE_DRAFT_ERROR`)
            );
            throw err;
        });
};

const getEditorContentObject = (
    data_hash: string,
    params: Record<string, unknown>
): Promise<unknown> => {
    return request
        .get(`/editor-content/${data_hash}`, { params })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            // TODO: Track with sentry
        });
};

const addComment = (
    hash: string,
    comment: Record<string, unknown>
): Promise<unknown> => {
    return request
        .put(`/add-comment/${hash}`, { comment })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const deleteComment = (hash: string, commentId: string): Promise<unknown> => {
    return request
        .put(`/delete-comment/${hash}`, { commentId })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

const ReviewTaskApi = {
    getMachineByDataHash,
    createReviewTask,
    getReviewTasks,
    autoSaveDraft,
    saveDraft,
    getEditorContentObject,
    addComment,
    deleteComment,
};

export default ReviewTaskApi;

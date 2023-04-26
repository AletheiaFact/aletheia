import { message } from "antd";
import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimreviewtask`,
});

const getClaimReviewTasks = (options) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        pageSize: options.pageSize ? options.pageSize : 5,
        value: options.value,
        filterUser: options.filterUser ? true : null,
    };
    console.log("#######", params.filterUser);

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
            return response.data.machine;
        })
        .catch(() => {
            // TODO: Track with sentry
        });
};

const createClaimReviewTask = (params, t, type) => {
    return request
        .post("/", { ...params })
        .then((response) => {
            message.success(t(`claimReviewTask:${type}_SUCCESS`));
            return response.data;
        })
        .catch((err) => {
            message.error(t(`claimReviewTask:${type}_ERROR`));
            throw err;
        });
};

const autoSaveDraft = (params, t) => {
    return request
        .put(`/${params.data_hash}`, { ...params })
        .then((response) => {
            message.success(t(`claimReviewTask:SAVE_DRAFT_SUCCESS`));
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const ClaimReviewTaskApi = {
    getMachineByDataHash,
    createClaimReviewTask,
    getClaimReviewTasks,
    autoSaveDraft,
};

export default ClaimReviewTaskApi;

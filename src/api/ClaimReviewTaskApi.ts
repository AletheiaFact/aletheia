import axios from "axios";
import { message } from "antd";

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
        usersId: options.usersId,
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

const getMachineBySentenceHash = (params, t) => {
    return request
        .get(`/sentence/${params}`)
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            message.error(t("claimReviewTask:errorWhileFetching"));
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

const autoSaveDraft = (params) => {
    console.log("asdasdasdsadasda", params);
    return request
        .put(`/${params.sentence_hash}`, { ...params })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw err;
        });
};

const ClaimReviewTaskApi = {
    getMachineBySentenceHash,
    createClaimReviewTask,
    getClaimReviewTasks,
    autoSaveDraft,
};

export default ClaimReviewTaskApi;

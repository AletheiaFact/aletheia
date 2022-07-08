import axios from "axios";
import { message } from "antd";
import { ParseMachineState } from "../utils/ParseMachineState";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimreviewtask`,
});

const getClaimReviewTasks = (options) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || 'asc',
        pageSize: options.pageSize ? options.pageSize : 5,
        value: options.value
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const { tasks, totalPages, totalTasks } = response.data;
            console.log('api response', tasks);

            return {
                data: tasks[0].reviews,
                total: totalTasks,
                totalPages
            }
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
    params.machine = ParseMachineState(params.machine)
    return request
        .post('/', { ...params })
        .then((response) => {
            message.success(t(`claimReviewTask:${type}_SUCCESS`))
            return response.data
        })
        .catch(err => {
            message.error(t(`claimReviewTask:${type}_ERROR`))
            throw err
        })
}

const updateClaimReviewTask = (params, t, type) => {
    params.machine = ParseMachineState(params.machine)
    return request
        .put(
            `/${params.sentence_hash}`,
            { ...params },
        )
        .then((response) => {
            message.success(t(`claimReviewTask:${type}_SUCCESS`))
            return response.data
        })
        .catch(err => {
            message.error(t(`claimReviewTask:${type}_ERROR`))
            throw err
        })
}

const ClaimReviewTaskApi = {
    getMachineBySentenceHash,
    createClaimReviewTask,
    updateClaimReviewTask,
    getClaimReviewTasks
}

export default ClaimReviewTaskApi

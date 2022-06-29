import axios from "axios";
import { message } from "antd";
import { ParseMachineState } from "../utils/ParseMachineState";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimreviewtask`,
});

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
            return err
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
            return err
        })
}

const ClaimReviewTaskApi = {
    getMachineBySentenceHash,
    createClaimReviewTask,
    updateClaimReviewTask,
}

export default ClaimReviewTaskApi

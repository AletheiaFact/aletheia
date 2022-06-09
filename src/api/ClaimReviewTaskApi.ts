import { message } from "antd";
import axios from "axios";
import { ParseMachineState } from "../utils/ParseMachineState";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimreviewtask`,
});

const getMachineBySentenceHash = (params) => {
    return request
        .get(
            `/sentence/${params}`,
            { ...params }
        )
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            message.error("erro ao pegar a maquina");
        });
};

const createClaimReviewTask = (params, t) => {
    params.machine = ParseMachineState(params.machine)
    return request
        .post('/', {...params})
        .then((response) => {
            message.success(t("claimReviewTask:userAssignedSuccess"))
            return response.data
        })
        .catch(err=>{
            message.error(t("claimReviewTask:userAssignedError"))
            return err
        })
}

const updateClaimReviewTask = (params, t) => {
    return request
        .put(
            `/${params.sentence_hash}`,
            { ...params },
        )
        .then((response) => {
            message.success(t("claimReviewTask:reportedSuccess"))
            return response.data
        })
        .catch(err=>{
            message.success(t("claimReviewTask:reportedError"))
            return err
        })
}


const ClaimReviewTaskApi = { getMachineBySentenceHash, createClaimReviewTask, updateClaimReviewTask }
export default ClaimReviewTaskApi

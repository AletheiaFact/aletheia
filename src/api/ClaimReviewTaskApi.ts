import { message } from "antd";
import axios from "axios";
import { ParseMachineState } from "../utils/ParseMachineState";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimreviewtask`,
});

const createClaimReviewTask = (params) => {
    params.machine = ParseMachineState(params.machine)
    return request
        .post('/', {...params})
        .then((response) => {
            // message.success(t("claimReviewTask:userAssignedSuccess"))
            message.success("deu certo")
            return response.data
        })
        .catch(err=>{
            // message.error(t("claimReviewTask:userAssignedError"))
            message.error("deu errado")
            return err
        })
}

const updateClaimReviewTask = (params, t = undefined) => {
    return request
        .put(
            `/${params.sentence_hash}`,
            { ...params },
        )
        .then((response) => {
            // message.success(t("claimReviewTask:reportedSuccess"))
            message.success("deu certo")
            return response.data
        })
        .catch(err=>{
            // message.success(t("claimReviewTask:reportedError"))
            message.error("deu errado")
            return err
        })
}


const ClaimReviewTaskApi = { createClaimReviewTask, updateClaimReviewTask }
export default ClaimReviewTaskApi

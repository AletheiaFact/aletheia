import { message } from "antd";
import axios from "axios";
import { ParseMachineState } from "../utils/ParseMachineState";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimreviewtask`,
});

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
            message.success('deu certo')
            return response.data
        })
        .catch(err=>{
            message.error('não deu certo')
            return err
        })
}


const ClaimReviewTaskApi = { createClaimReviewTask, updateClaimReviewTask }
export default ClaimReviewTaskApi

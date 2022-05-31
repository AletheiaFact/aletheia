import { message } from "antd";
import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claimreviewtask`,
});

const createClaimReviewTask = (params, t) => {
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
    console.log(params)
    return request
        .put(
            `/${params.sentence_hash}`,
            { ...params },
            { withCredentials: true }
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

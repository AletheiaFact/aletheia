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


const ClaimReviewTaskApi = { createClaimReviewTask }
export default ClaimReviewTaskApi

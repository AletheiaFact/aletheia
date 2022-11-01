import axios from "axios";
import { message } from "antd";

const request = axios.create({
    baseURL: `/api/claim-collection`,
});

const getById = (id, t, params = {}) => {
    return request
        .get(`${id}`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            // TODO: sentry
        });
};

const update = (id, t, params = {}) => {
    return request
        .put(`${id}`, params)
        .then((response) => {
            const { _id } = response.data;
            return _id;
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track unknow errors
                // TODO: use Sentry instead
                // console.log(err);
                return;
            }
            const { data } = response;
            message.error(
                data && data.message
                    ? data.message
                    : t("claimForm:errorUpdateMessage")
            );
        });
};
const claimCollectionApi = {
    getById,
    update,
};
export default claimCollectionApi;

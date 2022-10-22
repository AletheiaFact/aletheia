import axios from "axios";
import { message } from "antd";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/claim-collection`,
});

const getById = (id, t, params = {}) => {
    return request
        .get(
            `${id}`,
            {
                params,
            },
            { withCredentials: true }
        )
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            // TODO: sentry
        });
};

// const save = (t, claim = {}) => {
//     return request
//         .post("/", claim)
//         .then((response) => {
//             const { title } = response.data;
//             message.success(
//                 `"${title}" ${t("claimForm:successCreateMessage")}`
//             );
//             return response.data;
//         })
//         .catch((err) => {
//             const response = err && err.response;
//             if (!response) {
//                 // TODO: Track unknow errors
//                 // TODO: use Sentry instead
//                 // console.log(err);
//             }
//             const { data } = response;
//             message.error(
//                 data && data.message
//                     ? data.message
//                     : t("claimForm:errorCreateMessage")
//             );
//         });
// };

const update = (id, t, params = {}) => {
    return request
        .put(`${id}`, params)
        .then((response) => {
            const { title, _id } = response.data;
            message.success(
                `"${title}" ${t("claimForm:successUpdateMessage")}`
            );
            return _id;
        })
        .catch((err) => {
            const response = err && err.response;
            if (!response) {
                // TODO: Track unknow errors
                // TODO: use Sentry instead
                // console.log(err);
            }
            const { data } = response;
            message.error(
                data && data.message
                    ? data.message
                    : t("claimForm:errorUpdateMessage")
            );
        });
};

export default {
    getById,
    update,
};

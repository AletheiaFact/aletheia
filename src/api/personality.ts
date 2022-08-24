import axios from "axios";
import { message } from "antd";
import { ActionTypes } from "../store/types";

const baseUrl = `/api/personality`;
const getPersonalities = (options = {}, dispatch) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        name: options.searchName,
        pageSize: options.pageSize ? options.pageSize : 5,
        withSuggestions: options.withSuggestions,
        language: options?.i18n?.languages[0],
    };

    return axios
        .get(`${baseUrl}`, { params })
        .then((response) => {
            const { personalities, totalPages, totalPersonalities } =
                response.data;
            if (options.fetchOnly) {
                return {
                    data: personalities,
                    total: totalPersonalities,
                    totalPages,
                };
            }

            dispatch({
                type: ActionTypes.SEARCH_RESULTS,
                results: personalities,
            });
            dispatch({
                type: ActionTypes.SET_TOTAL_PAGES,
                totalPages,
            });
        })
        .catch((e) => {
            throw e;
        });
};

const getPersonality = (id, params, t) => {
    return axios
        .get(`${baseUrl}/${id}`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            message.error(t("personality:errorWhileFetching"));
        });
};

const createPersonality = (personality, t) => {
    return axios
        .post(`${baseUrl}`, personality, {
            withCredentials: true,
        })
        .then((response) => {
            const { name } = response.data;
            message.success(
                `"${name}" ${t("personalityCreateForm:successMessage")}`
            );
            return response.data;
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
                    : t("personalityCreateForm:errorMessage")
            );
        });
};

export default {
    getPersonalities,
    getPersonality,
    createPersonality,
};

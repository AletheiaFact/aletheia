import axios from "axios";
import { message } from "antd";

const baseUrl = `/api/personality`;
const getPersonalities = (options = {}, dispatch) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || 'asc',
        name: options.searchName,
        pageSize: options.pageSize ? options.pageSize : 0,
        withSuggestions: options.withSuggestions,
        language:
            options.i18n && options.i18n.languages && options.i18n.languages[0],
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
                type: "SEARCH_RESULTS",
                results: personalities,
            });
            dispatch({
                type: "SET_TOTAL_PAGES",
                totalPages,
            });
        })
        .catch((e) => {
            throw e;
        });
};

const getPersonality = (id, params) => {
    return axios
        .get(`${baseUrl}/${id}`, {
            params,
        })
        .then((response) => {
            return response.data;
        })
        .catch(() => {
            console.log("Error while fetching Personality");
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
                console.log(err);
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

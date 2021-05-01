import axios from "axios";
import { message } from "antd";

const getPersonalities = (options = {}, dispatch) => {
    const params = {
        page: options.page - 1,
        name: options.searchName,
        pageSize: options.pageSize,
        withSuggestions: options.withSuggestions,
        language:
            options.i18n && options.i18n.languages && options.i18n.languages[0]
    };

    return axios
        .get(`${process.env.API_URL}/personality`, { params })
        .then(response => {
            const {
                personalities,
                totalPages,
                totalPersonalities
            } = response.data;
            if (options.fetchOnly) {
                return {
                    data: personalities,
                    total: totalPersonalities,
                    totalPages
                };
            }

            dispatch({
                type: "SEARCH_RESULTS",
                results: personalities
            });
            dispatch({
                type: "SET_TOTAL_PAGES",
                totalPages
            });
        })
        .catch(e => {
            throw e;
        });
};

const getPersonality = (id, params) => {
    return axios
        .get(`${process.env.API_URL}/personality/${id}`, {
            params
        })
        .then(response => {
            return response.data;
        })
        .catch(() => {
            console.log("Error while fetching Personality");
        });
};

const createPersonality = (personality, t) => {
    return axios
        .post(`${process.env.API_URL}/personality`, personality, {
            withCredentials: true
        })
        .then(response => {
            const { name, _id } = response.data;
            message.success(
                `"${name}" ${t("personalityCreateForm:successMessage")}`
            );
            return _id;
        })
        .catch(err => {
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
    createPersonality
};

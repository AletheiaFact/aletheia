import axios from "axios";

const getPersonalities = (options = {}, dispatch) => {
    console.log(options);
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
            const { personalities, totalPages } = response.data;
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

export default {
    getPersonalities,
    getPersonality
};

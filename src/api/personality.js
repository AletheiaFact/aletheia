import axios from "axios";

const getPersonalities = (options = {}, dispatch) => {
    const params = {
        page: options.page - 1,
        name: options.searchName,
        pageSize: options.pageSize,
        withSuggestions: options.withSuggestions,
        language:
            options.i18n && options.i18n.languages && options.i18n.languages[0]
    };

    axios
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

export default {
    getPersonalities
};

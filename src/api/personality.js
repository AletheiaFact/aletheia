import axios from "axios";

const getPersonalities = (options, dispatch) => {
    const { page, searchName, pageSize } = options || {};
    const params = {
        page: page - 1,
        name: searchName,
        pageSize
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

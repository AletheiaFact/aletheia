import axios from "axios";
import { ActionTypes } from "../store/types";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/search`,
});

const getResults = (options = {}, dispatch) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        order: options.order || "asc",
        searchText: options.searchText,
        pageSize: options.pageSize ? options.pageSize : 5,
        language: options?.i18n?.languages[0],
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const { personalities, sentences } = response.data;

            dispatch({
                type: ActionTypes.SEARCH_RESULTS,
                results: { personalities, sentences },
            });
            dispatch({
                type: ActionTypes.SET_TOTAL_PAGES,
                totalPages: 1,
            });
        })
        .catch((e) => {
            console.log("e", e);
        });
};

const SearchApi = {
    getResults,
};

export default SearchApi;

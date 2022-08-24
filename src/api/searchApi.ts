import axios from "axios";
import { ActionTypes } from "../store/types";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/search`,
});

const getResults = (dispatch, options = {}) => {
    const params = {
        searchText: options.searchText,
        pageSize: options.pageSize ? options.pageSize : 5,
        language: options?.i18n?.languages[0],
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const { personalities, sentences, claims } = response.data;

            dispatch({
                type: ActionTypes.SEARCH_RESULTS,
                results: { personalities, sentences, claims },
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

import axios from "axios";
import actions from "../store/actions";
import { ActionTypes, SearchTypes } from "../store/types";

interface SearchOptions {
    type?: SearchTypes;
    searchText?: string;
    page?: number;
    pageSize?: number;
}

const request = axios.create({
    withCredentials: true,
    baseURL: `api/search`,
});

const getResults = (dispatch, options: SearchOptions = {}) => {
    const params = {
        type: options.type,
        searchText: options.searchText,
        page: options.page ? options.page : 0,
        pageSize: options.pageSize ? options.pageSize : 5,
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const { personalities, sentences, claims } = response.data;
            if (params.type === SearchTypes.AUTOCOMPLETE) {
                dispatch({
                    type: ActionTypes.RESULTS_AUTOCOMPLETE,
                    results: { personalities, sentences, claims },
                });
            } else {
                dispatch(actions.openResultsOverlay());
                dispatch({
                    type: ActionTypes.SEARCH_RESULTS,
                    results: { personalities, sentences, claims },
                });
            }
        })
        .catch((e) => {
            // TODO: sentry
        });
};

const SearchApi = {
    getResults,
};

export default SearchApi;

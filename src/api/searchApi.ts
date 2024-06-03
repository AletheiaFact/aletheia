import axios from "axios";
import actions from "../store/actions";
import { ActionTypes, SearchTypes } from "../store/types";
import { NameSpaceEnum } from "../types/Namespace";

interface SearchOptions {
    type?: SearchTypes;
    searchText?: string;
    page?: number;
    pageSize?: number;
    nameSpace?: string;
}

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/search`,
});

const getResults = (dispatch, options: SearchOptions = {}) => {
    const params = {
        type: options.type,
        searchText: options.searchText,
        page: options.page ? options.page : 0,
        pageSize: options.pageSize ? options.pageSize : 5,
        nameSpace: options.nameSpace ? options.nameSpace : NameSpaceEnum.Main,
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

const getFeedResults = (options: SearchOptions = {}): any => {
    const params = {
        type: options.type,
        searchText: options.searchText,
        page: options.page ? options.page : 0,
        pageSize: options.pageSize ? options.pageSize : 5,
        nameSpace: options.nameSpace ? options.nameSpace : NameSpaceEnum.Main,
    };

    return request
        .get(`/`, { params })
        .then((response) => {
            const { personalities, sentences, claims } = response.data;
            return {
                personalities,
                sentences,
                claims,
            };
        })
        .catch((e) => {
            console.error(e);
        });
};

const SearchApi = {
    getResults,
    getFeedResults,
};

export default SearchApi;

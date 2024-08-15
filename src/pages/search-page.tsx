import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import { GetLocale } from "../utils/GetLocale";
import SearchPageView from "../components/Search/SearchPageView";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";

const SearchPage: NextPage<any> = ({
    searchResults,
    searchText,
    pageSize,
    page,
    filter,
}) => {
    const dispatch = useDispatch();

    if (searchResults) {
        const { personalities, sentences, claims, totalResults, totalPages } =
            searchResults;
        dispatch({
            type: ActionTypes.SET_CUR_PAGE,
            page: page,
        });
        dispatch({
            type: ActionTypes.SET_TOTAL_PAGES,
            totalPages: totalPages,
        });
        dispatch({
            type: ActionTypes.SEARCH_RESULTS,
            results: { personalities, sentences, claims },
        });
        dispatch({
            type: ActionTypes.SET_TOTAL_RESULTS,
            totalResults: totalResults,
        });
        dispatch({
            type: ActionTypes.SET_SEARCH_NAME,
            searchName: searchText,
        });
        dispatch({
            type: ActionTypes.SET_PAGE_SIZE,
            pageSize: pageSize,
        });
        dispatch({
            type: ActionTypes.SET_SEARCH_FILTER_USED,
            filterUsed: filter,
        });
        dispatch({
            type: ActionTypes.SET_SEARCH_FILTER,
            filters: filter,
        });
    }

    return (
        <>
            <SearchPageView searchText={searchText} />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            searchResults: query.searchResults
                ? JSON.parse(JSON.stringify(query.searchResults))
                : null,
            searchText: query.searchText
                ? JSON.parse(JSON.stringify(query.searchText))
                : null,
            pageSize: query.pageSize
                ? JSON.parse(JSON.stringify(query.pageSize))
                : null,
            page: query.page ? JSON.parse(JSON.stringify(query.page)) : null,
            filter: query.filter
                ? JSON.parse(JSON.stringify(query.filter))
                : null,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default SearchPage;

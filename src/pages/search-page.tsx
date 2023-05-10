import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import { GetLocale } from "../utils/GetLocale";
import SearchPageView from "../components/Search/SearchPageView";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";

const SearchPage: NextPage<any> = ({ searchResults }) => {
    const dispatch = useDispatch();

    if (searchResults) {
        const { personalities, sentences, claims } = searchResults;
        dispatch({
            type: ActionTypes.SEARCH_RESULTS,
            results: { personalities, sentences, claims },
        });
    }

    return (
        <>
            <SearchPageView />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            searchResults: query.searchResults
                ? JSON.parse(JSON.stringify(query.searchResults))
                : null,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default SearchPage;

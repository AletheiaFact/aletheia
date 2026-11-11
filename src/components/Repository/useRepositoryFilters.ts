import { useEffect, useState } from "react";
import {
    EMPTY_FILTERS,
    clearedFilters,
    RepositoryFilters,
    RepositoryQuery,
    RepositoryTab,
    parseFilters,
    parseTab,
    toSearchParams,
} from "./repositoryFilters";

const SEARCH_DEBOUNCE_MS = 400;

// The open tab, each tab's filters and the search text, kept in the URL
const useRepositoryFilters = (initialQuery: RepositoryQuery) => {
    const [tab, setTab] = useState<RepositoryTab>(() => parseTab(initialQuery));
    // Each tab keeps its own filters; the URL reflects the open tab.
    const [filtersByTab, setFiltersByTab] = useState<
        Record<RepositoryTab, RepositoryFilters>
    >(() => {
        const initialTab = parseTab(initialQuery);
        const initialFilters = parseFilters(initialQuery);
        return {
            claims: initialTab === "claims" ? initialFilters : EMPTY_FILTERS,
            reviews: initialTab === "reviews" ? initialFilters : EMPTY_FILTERS,
        };
    });
    const filters = filtersByTab[tab];
    // Typed text; copied into the filters once the user stops typing
    const [searchText, setSearchText] = useState(filters.q);

    const updateFilters = (changes: Partial<RepositoryFilters>) =>
        setFiltersByTab((previous) => ({
            ...previous,
            [tab]: { ...previous[tab], ...changes },
        }));

    const clearFilters = () => {
        setSearchText("");
        updateFilters(clearedFilters(filters));
    };

    const changeTab = (nextTab: RepositoryTab) => {
        setTab(nextTab);
        setSearchText(filtersByTab[nextTab].q);
    };

    useEffect(() => {
        if (searchText === filters.q) return;
        const timer = setTimeout(
            () =>
                setFiltersByTab((previous) => ({
                    ...previous,
                    [tab]: { ...previous[tab], q: searchText },
                })),
            SEARCH_DEBOUNCE_MS
        );
        return () => clearTimeout(timer);
    }, [searchText, tab, filters.q]);

    useEffect(() => {
        const params = toSearchParams(tab, filters).toString();
        const search = params ? "?" + params : "";
        const url = window.location.pathname + search;
        // Replace without a Next navigation: the page is rendered by Nest,
        // so the Next router does not know the /claim route.
        window.history.replaceState(window.history.state, "", url);
    }, [tab, filters]);

    return {
        tab,
        changeTab,
        filters,
        updateFilters,
        clearFilters,
        searchText,
        setSearchText,
    };
};

export default useRepositoryFilters;

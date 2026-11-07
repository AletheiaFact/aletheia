import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import claimApi from "../../api/claimApi";
import claimReviewApi from "../../api/claimReviewApi";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import {
    RepositoryFilters,
    RepositoryTab,
    toClaimParams,
    toReviewParams,
} from "./repositoryFilters";

const PAGE_SIZE = 12;

interface ListState {
    tab: RepositoryTab | null;
    items: any[];
    total: number;
    totalPages: number;
    page: number;
    contentModelCounts: Record<string, number>;
}

const EMPTY_LIST: ListState = {
    tab: null,
    items: [],
    total: 0,
    totalPages: 0,
    page: 0,
    contentModelCounts: {},
};

const useRepositoryList = (tab: RepositoryTab, filters: RepositoryFilters) => {
    const { i18n } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [list, setList] = useState<ListState>(EMPTY_LIST);
    // The page being fetched; 1 means the list is being (re)built.
    const [loadingPage, setLoadingPage] = useState<number | null>(1);
    const [error, setError] = useState(false);
    // Only the latest request may update the list, so a slow response for
    // an older filter never overwrites a newer one.
    const requestId = useRef(0);

    const fetchPage = useCallback(
        (page: number) => {
            const options = {
                page,
                pageSize: PAGE_SIZE,
                nameSpace: (nameSpace || NameSpaceEnum.Main) as NameSpaceEnum,
            };
            return tab === "claims"
                ? claimApi.get({
                      ...options,
                      ...toClaimParams(filters),
                      i18n,
                      fetchOnly: true,
                  })
                : claimReviewApi.get({ ...options, ...toReviewParams(filters) });
        },
        [tab, filters, nameSpace, i18n]
    );

    const load = useCallback(
        async (page: number) => {
            const id = ++requestId.current;
            setLoadingPage(page);
            setError(false);
            try {
                const response = await fetchPage(page);
                if (id !== requestId.current) return;
                if (!response) throw new Error("Empty response");
                setList((previous) => ({
                    tab,
                    items:
                        page === 1
                            ? response.data
                            : [...previous.items, ...response.data],
                    total: response.total,
                    totalPages: response.totalPages,
                    page,
                    contentModelCounts: response.contentModelCounts || {},
                }));
            } catch {
                if (id !== requestId.current) return;
                setError(true);
                if (page === 1) setList({ ...EMPTY_LIST, tab });
            } finally {
                if (id === requestId.current) setLoadingPage(null);
            }
        },
        [fetchPage, tab]
    );

    useEffect(() => {
        load(1);
    }, [load]);

    const loadMore = () => load(list.page + 1);

    return {
        ...list,
        loading: loadingPage !== null,
        // Items of the other tab are never handed to this tab's cards
        refreshing: loadingPage === 1 || list.tab !== tab,
        error,
        hasMore: list.page < list.totalPages,
        loadMore,
    };
};

export default useRepositoryList;

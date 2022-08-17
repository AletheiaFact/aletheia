import { useMemo } from "react";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { RootState, ActionTypes } from "./types";

let store;

const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.TOGGLE_MENU:
            return {
                ...state,
                menuCollapsed: action.menuCollapsed,
            };
        case ActionTypes.ENABLE_SEARCH_OVERLAY:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    overlay: action.overlay,
                },
            };
        case ActionTypes.SEARCH_RESULTS:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchResults: action.results,
                },
            };
        case ActionTypes.SET_TOTAL_PAGES:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchTotalPages: action.totalPages,
                },
            };
        case ActionTypes.SET_CUR_PAGE:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchCurPage: action.page,
                },
            };
        case ActionTypes.SET_SEARCH_NAME:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchInput: action.searchName,
                },
            };
        case ActionTypes.SET_LOGIN_STATUS:
            return {
                ...state,
                login: action.login,
            };
        case ActionTypes.SET_BREAKPOINTS:
            return {
                ...state,
                breakpoints: action.breakpoints,
            };
        default:
            return state;
    }
};

function initStore(preloadedState) {
    return createStore(reducer, preloadedState, applyMiddleware());
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? initStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        });
        // Reset the current store
        store = undefined;
    }

    // For SSG and SSR always create a new store
    if (typeof window === "undefined") return _store;
    // Create the store once in the client
    if (!store) store = _store;

    return _store;
};

export function useStore() {
    return useMemo(() => initializeStore({}), []);
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { ActionTypes, RootState } from "./types";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { applyMiddleware, createStore } from "redux";

import { useMemo } from "react";

let store;

const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.TOGGLE_MENU:
            return {
                ...state,
                menuCollapsed: action.menuCollapsed,
            };
        case ActionTypes.TOGGLE_REVIEW_DRAWER:
            return {
                ...state,
                reviewDrawerCollapsed: action.reviewDrawerCollapsed,
            };
        case ActionTypes.SET_TOTAL_RESULTS:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    totalResults: action.totalResults,
                },
            };
        case ActionTypes.RESULTS_OVERLAY_VISIBLE:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    overlayVisible: action.overlayVisible,
                },
            };
        case ActionTypes.RESULTS_AUTOCOMPLETE:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    autocompleteResults: action.results,
                },
            };
        case ActionTypes.RESULTS_TOPICS_AUTOCOMPLETE:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    autocompleteTopicsResults: action.results,
                },
            };
        case ActionTypes.RESULTS_SEARCH_VISIBLE:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    resultsVisible: action.resultsVisible,
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
        case ActionTypes.SET_PAGE_SIZE:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchPageSize: action.pageSize,
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
        case ActionTypes.SET_SEARCH_FILTER:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchFilter: action.filters,
                },
            };
        case ActionTypes.SET_SEARCH_FILTER_USED:
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchFilterUsed: action.filterUsed,
                },
            };
        case ActionTypes.SET_LOGIN_STATUS:
            return {
                ...state,
                login: action.login,
            };
        case ActionTypes.SET_AUTO_SAVE:
            return {
                ...state,
                autoSave: action.autoSave,
            };
        case ActionTypes.SET_WEBSOCKET_URL:
            return {
                ...state,
                websocketUrl: action.websocketUrl,
            };
        case ActionTypes.SET_COLLABORATIVE_EDIT:
            return {
                ...state,
                enableCollaborativeEdit: action.enableCollaborativeEdit,
            };
        case ActionTypes.SET_AGENT_REVIEW:
            return {
                ...state,
                enableAgentReview: action.enableAgentReview,
            };
        case ActionTypes.SET_EDITOR_ANNOTATION:
            return {
                ...state,
                enableEditorAnnotations: action.enableEditorAnnotations,
            };
        case ActionTypes.SET_USER_ROLE:
            return {
                ...state,
                role: action.role,
            };
        case ActionTypes.SET_BREAKPOINTS:
            return {
                ...state,
                vw: action.vw,
            };
        case ActionTypes.SET_CLAIM_CREATE_TYPE:
            return {
                ...state,
                claimType: action.claimType,
            };
        case ActionTypes.SET_CLAIM_CREATE_PERSONALITY:
            return {
                ...state,
                claimPersonality: action.claimPersonality,
            };
        case ActionTypes.SET_SELECTED_PERSONALITY:
            return {
                ...state,
                selectedPersonality: action.selectedPersonality,
            };
        case ActionTypes.SET_SELECTED_CLAIM:
            return {
                ...state,
                selectedClaim: action.selectedClaim,
            };
        case ActionTypes.SET_SELECTED_CONTENT:
            return {
                ...state,
                selectedContent: action.selectedContent,
                selectedDataHash: action.selectedDataHash,
            };
        case ActionTypes.SET_USER_ID:
            return {
                ...state,
                userId: action.userId,
            };
        case ActionTypes.SET_SITEKEY:
            return {
                ...state,
                sitekey: action.sitekey,
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

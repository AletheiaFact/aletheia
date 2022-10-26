import { WidthBreakpoints } from "../hooks/useMediaQueryBreakpoints";

export enum ActionTypes {
    TOGGLE_MENU,
    TOGGLE_REVIEW_DRAWER,
    RESULTS_OVERLAY_VISIBLE,
    SEARCH_RESULTS,
    SET_TOTAL_PAGES,
    SET_CUR_PAGE,
    SET_SEARCH_NAME,
    SET_LOGIN_STATUS,
    SET_AUTO_SAVE,
    SET_BREAKPOINTS,
    SET_USER_ROLE,
    SET_SELECTED_DATA_HASH,
    SET_SELECTED_PERSONALITY,
    SET_SELECTED_CLAIM,
    SET_SELECTED_SENTENCE,
    SET_USER_ID,
}

export interface RootState {
    menuCollapsed: boolean;
    reviewDrawerCollapsed: boolean;
    search: {
        overlayVisible: boolean;
        searchResults: any;
        searchTotalPages: any;
        searchCurPage: number;
        searchInput: string;
        searchPageSize: number;
    };
    login: boolean;
    autoSave: boolean;
    role: string;
    vw: WidthBreakpoints;
    selectedDataHash: string;
    selectedPersonality: any;
    selectedClaim: any;
    selectedSentence: any;
    userId: string;
}

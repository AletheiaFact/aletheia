import { WidthBreakpoints } from "../hooks/useMediaQueryBreakpoints";

export enum ActionTypes {
    TOGGLE_MENU,
    RESULTS_OVERLAY_VISIBLE,
    SEARCH_RESULTS,
    SET_TOTAL_PAGES,
    SET_CUR_PAGE,
    SET_SEARCH_NAME,
    SET_LOGIN_STATUS,
    SET_AUTO_SAVE,
    SET_BREAKPOINTS,
    SET_USER_ROLE,
    SET_CLAIM_CREATE_TYPE,
    SET_CLAIM_CREATE_PERSONALITY,
}

export interface RootState {
    menuCollapsed: boolean;
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
    claimType: string;
    claimPersonality: any;
    vw: WidthBreakpoints;
}

import { WidthBreakpoints } from "../hooks/useMediaQueryBreakpoints";

export enum ActionTypes {
    TOGGLE_MENU,
    ENABLE_SEARCH_OVERLAY,
    SEARCH_RESULTS,
    SET_TOTAL_PAGES,
    SET_CUR_PAGE,
    SET_SEARCH_NAME,
    SET_LOGIN_STATUS,
    SET_BREAKPOINTS,
    SET_CLAIM_CREATE_TYPE,
    SET_CLAIM_CREATE_PERSONALITY,
}

export interface RootState {
    menuCollapsed: boolean;
    search: {
        overlay: any;
        searchResults: any;
        searchTotalPages: any;
        searchCurPage: number;
        searchInput: string;
        searchPageSize: number;
    };
    login: boolean;
    claimType: string;
    claimPersonality: any;
    vw: WidthBreakpoints;
}

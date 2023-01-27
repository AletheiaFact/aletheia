import { WidthBreakpoints } from "../hooks/useMediaQueryBreakpoints";
import { Content } from "../types/Content";
import { Personality } from "../types/Personality";

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
    SET_CLAIM_CREATE_TYPE,
    SET_CLAIM_CREATE_PERSONALITY,
    SET_SELECTED_PERSONALITY,
    SET_SELECTED_CLAIM,
    SET_SELECTED_CONTENT,
    SET_USER_ID,
    SET_SITEKEY,
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
    autoSave: boolean;
    claimType: string;
    claimPersonality: Personality;
    vw: WidthBreakpoints;
    selectedDataHash: string;
    selectedPersonality: any;
    selectedClaim: any;
    selectedContent: Content;
    sitekey: string;
}

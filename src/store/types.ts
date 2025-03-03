import { Content } from "../types/Content";
import { Personality } from "../types/Personality";
import { WidthBreakpoints } from "../hooks/useMediaQueryBreakpoints";

export enum ActionTypes {
    SET_WEBSOCKET_URL,
    RESULTS_AUTOCOMPLETE,
    RESULTS_LOADING,
    TOGGLE_MENU,
    TOGGLE_REVIEW_DRAWER,
    TOGGLE_COPILOT_DRAWER,
    RESULTS_OVERLAY_VISIBLE,
    SEARCH_RESULTS,
    SEARCH_PERSONALITIES_RESULTS,
    SEARCH_OVERLAY_RESULTS,
    SET_TOTAL_PAGES,
    SET_CUR_PAGE,
    SET_SEARCH_NAME,
    SET_LOGIN_STATUS,
    SET_BREAKPOINTS,
    SET_USER_ROLE,
    SET_CLAIM_CREATE_TYPE,
    SET_CLAIM_CREATE_PERSONALITY,
    SET_SELECTED_PERSONALITY,
    SET_SELECTED_TARGET,
    SET_SELECTED_CONTENT,
    SET_USER_ID,
    SET_SITEKEY,
    RESULTS_SEARCH_VISIBLE,
    SET_TOTAL_RESULTS,
    SET_PAGE_SIZE,
    RESULTS_TOPICS_AUTOCOMPLETE,
    SET_SEARCH_FILTER,
    SET_SEARCH_FILTER_USED,
    SET_VISUAL_EDITOR_ENVIRONEMNT,
    SET_TOPIC_FILTER_USED,
    SET_SEARCH_OVERLAY_NAME,
}

export enum SearchTypes {
    AUTOCOMPLETE,
    OVERLAY,
    RESULTS,
}

export interface RootState {
    menuCollapsed: boolean;
    reviewDrawerCollapsed: boolean;
    copilotDrawerCollapsed: boolean;
    search: {
        resultsVisible: boolean;
        isFetching: boolean;
        autocompleteResults: any;
        autocompleteTopicsResults: any;
        overlayVisible: boolean;
        searchResults: any;
        searchPersonalitiesResults: any;
        searchOverlayResults: any;
        searchTotalPages: any;
        searchCurPage: number;
        searchInput: string;
        searchOverlayInput: string;
        searchFilter: any;
        searchFilterUsed: any;
        searchPageSize: number;
        totalResults: number;
    };
    topicFilterUsed: any;
    autoSave: boolean;
    enableCollaborativeEdit: boolean;
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableReviewersUpdateReport: boolean;
    enableViewReportPreview: boolean;
    websocketUrl: string;
    claimType: string;
    claimPersonality: Personality;
    vw: WidthBreakpoints;
    selectedDataHash: string;
    selectedPersonality: any;
    selectedTarget: any;
    selectedContent: Content;
    sitekey: string;
}

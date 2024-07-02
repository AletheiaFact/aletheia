import { Content } from "../types/Content";
import { Personality } from "../types/Personality";
import { WidthBreakpoints } from "../hooks/useMediaQueryBreakpoints";

export enum ActionTypes {
    SET_WEBSOCKET_URL,
    RESULTS_AUTOCOMPLETE,
    TOGGLE_MENU,
    TOGGLE_REVIEW_DRAWER,
    TOGGLE_COPILOT_DRAWER,
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
    SET_COLLABORATIVE_EDIT,
    SET_COPILOT_CHAT_BOT,
    SET_EDITOR_ANNOTATION,
    SET_ADD_EDITOR_SOURCES_WITHOUT_SELECTING,
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
        autocompleteResults: any;
        autocompleteTopicsResults: any;
        overlayVisible: boolean;
        searchResults: any;
        searchTotalPages: any;
        searchCurPage: number;
        searchInput: string;
        searchFilter: any;
        searchFilterUsed: any;
        searchPageSize: number;
        totalResults: number;
    };
    autoSave: boolean;
    enableCollaborativeEdit: boolean;
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableAddEditorSourcesWithoutSelecting: boolean;
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

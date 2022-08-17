export enum ActionTypes {
    TOGGLE_MENU,
    ENABLE_SEARCH_OVERLAY,
    SEARCH_RESULTS,
    SET_TOTAL_PAGES,
    SET_CUR_PAGE,
    SET_SEARCH_NAME,
    SET_LOGIN_STATUS,
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
    user: any;
}

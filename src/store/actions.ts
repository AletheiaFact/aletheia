import { Content } from "../types/Content";
import { Roles } from "../types/enums";
import { ActionTypes } from "./types";

const actions = {
    openResultsOverlay: () => ({
        type: ActionTypes.RESULTS_OVERLAY_VISIBLE,
        overlayVisible: true,
    }),
    closeResultsOverlay: () => ({
        type: ActionTypes.RESULTS_OVERLAY_VISIBLE,
        overlayVisible: false,
    }),
    openSideMenu: () => ({
        type: ActionTypes.TOGGLE_MENU,
        menuCollapsed: false,
    }),
    closeSideMenu: () => ({
        type: ActionTypes.TOGGLE_MENU,
        menuCollapsed: true,
    }),
    openReviewDrawer: () => ({
        type: ActionTypes.TOGGLE_REVIEW_DRAWER,
        reviewDrawerCollapsed: false,
    }),
    closeReviewDrawer: () => ({
        type: ActionTypes.TOGGLE_REVIEW_DRAWER,
        reviewDrawerCollapsed: true,
    }),
    setSelectPersonality: (personality) => ({
        type: ActionTypes.SET_SELECTED_PERSONALITY,
        selectedPersonality: personality,
    }),
    setSelectClaim: (claim) => ({
        type: ActionTypes.SET_SELECTED_CLAIM,
        selectedClaim: claim,
    }),
    setSelectContent: (content: Content) => ({
        type: ActionTypes.SET_SELECTED_CONTENT,
        selectedContent: content,
        selectedDataHash: content?.data_hash || "",
    }),
    setLoginStatus: (isLoggedIn) => ({
        type: ActionTypes.SET_LOGIN_STATUS,
        login: isLoggedIn,
    }),
    setUserId: (userId) => ({
        type: ActionTypes.SET_USER_ID,
        userId,
    }),
    setUserRole: (role) => ({
        type: ActionTypes.SET_USER_ROLE,
        role: role || Roles.Regular,
    }),
    setSitekey: (sitekey) => ({
        type: ActionTypes.SET_SITEKEY,
        sitekey,
    }),
};

export default actions;

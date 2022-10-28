import { Roles } from "../machine/enums";
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
    setSelectDataHash: (hash) => ({
        type: ActionTypes.SET_SELECTED_DATA_HASH,
        selectedDataHash: hash,
    }),
    setSelectPersonality: (personality) => ({
        type: ActionTypes.SET_SELECTED_PERSONALITY,
        selectedPersonality: personality,
    }),
    setSelectClaim: (claim) => ({
        type: ActionTypes.SET_SELECTED_CLAIM,
        selectedClaim: claim,
    }),
    setSelectSentence: (sentence) => ({
        type: ActionTypes.SET_SELECTED_SENTENCE,
        selectedSentence: sentence,
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

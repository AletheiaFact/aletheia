import { Content } from "../types/Content";
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
    openCopilotDrawer: () => ({
        type: ActionTypes.TOGGLE_COPILOT_DRAWER,
        copilotDrawerCollapsed: false,
    }),
    closeCopilotDrawer: () => ({
        type: ActionTypes.TOGGLE_COPILOT_DRAWER,
        copilotDrawerCollapsed: true,
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
    setSitekey: (sitekey) => ({
        type: ActionTypes.SET_SITEKEY,
        sitekey,
    }),
    setWebsocketUrl: (websocketUrl) => ({
        type: ActionTypes.SET_WEBSOCKET_URL,
        websocketUrl,
    }),
};

export default actions;

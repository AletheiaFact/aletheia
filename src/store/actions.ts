import { Content } from "../types/Content";
import { ActionTypes } from "./types";

const actions = {
    setResultsLoading: (isFetching) => ({
        type: ActionTypes.RESULTS_LOADING,
        isFetching,
    }),
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
    setSelectTarget: (target) => ({
        type: ActionTypes.SET_SELECTED_TARGET,
        selectedTarget: target,
    }),
    setSelectContent: (content: Content) => ({
        type: ActionTypes.SET_SELECTED_CONTENT,
        selectedContent: content,
        selectedDataHash: content?.data_hash || "",
        selectedReviewTaskType: content?.reviewTaskType,
    }),
    setSitekey: (sitekey) => ({
        type: ActionTypes.SET_SITEKEY,
        sitekey,
    }),
    setWebsocketUrl: (websocketUrl) => ({
        type: ActionTypes.SET_WEBSOCKET_URL,
        websocketUrl,
    }),
    setEditorEnvironment: (
        enableCollaborativeEdit,
        enableAddEditorSourcesWithoutSelecting,
        enableEditorAnnotations,
        enableCopilotChatBot,
        autoSave,
        enableReviewersUpdateReport,
        enableViewReportPreview
    ) => {
        return {
            type: ActionTypes.SET_VISUAL_EDITOR_ENVIRONEMNT,
            enableCollaborativeEdit,
            enableAddEditorSourcesWithoutSelecting,
            enableEditorAnnotations,
            enableCopilotChatBot,
            autoSave,
            enableReviewersUpdateReport,
            enableViewReportPreview,
        };
    },
};

export default actions;

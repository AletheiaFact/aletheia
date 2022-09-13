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
};

export default actions;

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function appReducer(state, action) {
    switch (action.type) {
        case "TOGGLE_MENU":
            return {
                ...state,
                menuCollapsed: action.menuCollapsed
            };
        case "ENABLE_SEARCH_OVERLAY":
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    overlay: action.overlay
                }
            };
        case "SEARCH_RESULTS":
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchResults: action.results
                }
            };
        case "SET_TOTAL_PAGES":
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchTotalPages: action.totalPages
                }
            };
        case "SET_CUR_PAGE":
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchCurPage: action.page
                }
            };
        case "SET_SEARCH_NAME":
            return {
                ...state,
                search: {
                    ...(state?.search || {}),
                    searchInput: action.searchName
                }
            };
        case "SET_LOGIN_VALIDATION":
            return {
                ...state,
                login: action.login
            };
        default:
            return state;
    }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(appReducer, applyMiddleware(thunk));

export default store;

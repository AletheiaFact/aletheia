import { createStore } from "redux";

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
function handleSearchData(state, action) {
    switch (action.type) {
        case "SEARCH_RESULTS":
            return { ...state, searchResults: action.results };
        case "SET_TOTAL_PAGES":
            return { ...state, searchTotalPages: action.totalPages };
        case "SET_CUR_PAGE":
            return { ...state, searchCurPage: action.page };
        case "SET_SEARCH_NAME":
            return { ...state, searchInput: action.searchName };
        default:
            return state;
    }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(handleSearchData);

export default store;

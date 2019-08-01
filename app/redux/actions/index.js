import {
    // ADD_NEW_WINE,
    SET_RESULTS,
    RESET_RESULTS,
    SET_WINES,
    RESET_WINES,
    SET_CELLARS,
    SET_WINE,
    SET_CELLAR,
    RESET_CELLAR,
    RESET_WINE,
    SET_USER,
    DELETE_WINES,
    RESET_SEARCH,
    SET_SEARCH,
    DELETE_CELLARS,
    LOG_OUT
    } from "../constants/action-types";
    export const logOut = item => ({ type: LOG_OUT, payload: item });
    export const setResults = item => ({ type: SET_RESULTS, payload: item });
    export const resetResults = item => ({ type: RESET_RESULTS, payload: item });
    export const setUser = item => ({ type: SET_USER, payload: item });
    export const setCellars = item => ({ type: SET_CELLARS, payload: item });
    export const setWines = item => ({ type: SET_WINES, payload: item });
    export const setWine = item => ({ type: SET_WINE, payload: item });
    export const removeWines = item => ({ type: DELETE_WINES, payload: item });
    export const setCellar = item => ({ type: SET_CELLAR, payload: item });
    export const resetCellar = item => ({ type: RESET_CELLAR, payload: item });
    export const resetWine = item => ({ type: RESET_WINE, payload: item });
    export const resetWines = item => ({ type: RESET_WINES, payload: item });
    export const resetSearch = item => ({ type: RESET_SEARCH, payload: item });
    export const setSearch = item => ({ type: SET_SEARCH, payload: item });
    export const removeCellars = item => ({ type: DELETE_CELLARS, payload: item });

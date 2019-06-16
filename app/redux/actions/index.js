import {
    // ADD_NEW_WINE,
    SET_WINES,
    SET_CELLARS,
    SET_WINE,
    SET_CELLAR,
    RESET_CELLAR,
    RESET_WINE,
    SET_USER
    } from "../constants/action-types";
    export const setUser = item => ({ type: SET_USER, payload: item });
    export const setCellars = item => ({ type: SET_CELLARS, payload: item });
    export const setWines = item => ({ type: SET_WINES, payload: item });
    export const setWine = item => ({ type: SET_WINE, payload: item });
    export const setCellar = item => ({ type: SET_CELLAR, payload: item });
    export const resetCellar = item => ({ type: RESET_CELLAR, payload: item });
    export const resetWine = item => ({ type: RESET_WINE, payload: item });
    // export const dispatchMsg = item => ({ type: DISPATCH_MSG, payload: item })

import {
    ADD_NEW_WINE,
    GET_WINES,
    SAVE_QUERY,
    IS_SEARCHING,
    DISPATCH_MSG,
    SET_USER
    } from "../constants/action-types";
    export const toggleSearch = item => ({ type: IS_SEARCHING, payload: item });
    export const saveQuery = item => ({ type: SAVE_QUERY, payload: item });
    export const setUser = item => ({ type: SET_USER, payload: item });
    export const getWines = item => ({ type: GET_WINES, payload: item });
    export const addNewWine = item => ({ type: ADD_NEW_WINE, payload: item })
    export const dispatchMsg = item => ({ type: DISPATCH_MSG, payload: item })

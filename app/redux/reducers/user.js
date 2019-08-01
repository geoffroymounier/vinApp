import {
    SET_USER,LOG_OUT
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = {};
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function user(state = initialState, action) {
switch (action.type) {
  case SET_USER:
    return {
      ...state,
      ...action.payload
    }
    break;
  case LOG_OUT:
    return {}
    break;
  default:
    return state
  }
}

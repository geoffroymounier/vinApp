import {
    SET_SEARCH,
    RESET_SEARCH
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = {};
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function user(state = initialState, action) {
switch (action.type) {
  case 'SET_SEARCH':
    return {
      ...state,
      ...action.payload
    }
    break;
  case 'RESET_SEARCH':
      return {}
      break;
  default:
    return state
  }
}

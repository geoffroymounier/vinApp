import {
    SET_SEARCH,
    RESET_SEARCH,
    LOG_OUT
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = {};
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function user(state = initialState, action) {
switch (action.type) {
  case SET_SEARCH:
    let newState = {...state}
    for (var i in action.payload){
      if (action.payload[i] != null){
        newState[i] = action.payload[i]
      } else if (newState[i]) {
        delete newState[i]
      }
    }
    return newState
    break;
  case RESET_SEARCH:
      return {}
      break;
  case LOG_OUT:
      return {}
      break;
  default:
    return state
  }
}

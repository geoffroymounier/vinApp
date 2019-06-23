import {
    SET_RESULTS,
    RESET_RESULTS
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = null;
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function user(state = initialState, action) {
switch (action.type) {
  case 'SET_RESULTS':
    let newState = !state ? [] : [...state]
    if (newState.length == 0) return action.payload // state init
    for (var i in action.payload){ // or replace certain item in state
      let wine = action.payload[i];
      let j = newState.findIndex(m=>m._id == wine._id);
      if (j != -1) newState[j]=wine;
      else newState.push(wine)
    }
    return newState
    break;
  case 'RESET_RESULTS':
      return null
      break;
  default:
    return state
  }
}

import {
    SET_USER
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = {};
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function user(state = initialState, action) {
switch (action.type) {
  case 'SET_USER':
  console.log(action.payload)
    return {
      ...state,
      ...action.payload
    }
    break;
  default:
    return state
  }
}

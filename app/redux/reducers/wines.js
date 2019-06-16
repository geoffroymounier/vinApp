import {
    SET_WINES
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = [];
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function carers(state = initialState, action) {
switch (action.type) {
  case 'SET_WINES': //filter only carers

    let newState = [...state]
    if (newState.length == 0) return action.payload // state init
    for (var i in action.payload){ // or replace certain item in state
      let wine = action.payload[i];
      let j = newState.findIndex(m=>m._id == wine._id);
      if (j != -1) newState[j]=wine;
      else newState.push(wine)
    }
    return newState
    break;
  default:
    return state
  }
}

import {
    SET_WINES,
    DELETE_WINES,
    RESET_WINES,
    LOG_OUT
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux
const Buffer = require('buffer').Buffer
const initialState = null;
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function carers(state = initialState, action) {
let newState;
switch (action.type) {
  case DELETE_WINES:

    if (Array.isArray(action.payload)){
      newState = !state ? [] : [...state]
      for (var i in action.payload){ // or replace certain item in state
        let wineId = action.payload[i];
        let j = newState.findIndex(m=> (m._id == wineId));
        if (j != -1) newState.splice(j,1)
      }
    } else {
      newState = (state||[]).filter(m => m.cellarId != action.payload)
    }

    return newState
    break;
  case SET_WINES: //filter only carers
    newState = !state ? [] : [...state]

    if (newState.length == 0) return action.payload // state init
    for (var i in action.payload){ // or replace certain item in state
      let wine = action.payload[i];
      if (action.payload[i].photo) {
        let base64 = new Buffer(action.payload[i].photo).toString();
        wine.photo = base64
      }
      let j = newState.findIndex(m=>m._id == wine._id);
      if (j != -1) newState[j]=wine;
      else newState.push(wine)
    }
    return newState
    break;
  case RESET_WINES:
      return null
      break;
  case LOG_OUT:
      return null
      break;
  default:
    return state
  }
}

import {
    SET_RESULTS,
    RESET_RESULTS,
    LOG_OUT,
    SET_WINES
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux
const Buffer = require('buffer').Buffer
const initialState = null;
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function user(state = initialState, action) {
switch (action.type) {
  case SET_RESULTS:
    // newState = !state ? [] : [...state]
    return action.payload
    // if (newState.length == 0) return action.payload // state init
    // for (var i in action.payload){ // or replace certain item in state
    //   let wine = action.payload[i];
    //   if (action.payload[i].photo) {
    //     let base64 = new Buffer(action.payload[i].photo).toString();
    //     wine.photo = base64
    //   }
    //   let j = newState.findIndex(m=>m._id == wine._id);
    //   if (j != -1) newState[j]=wine;
    //   else newState.push(wine)
    // }
    // return newState.filter(())
    break;
  case SET_WINES:
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
    }
    return newState
    break;
  case RESET_RESULTS:
      return null
      break;
  case LOG_OUT:
      return null
      break;
  default:
    return state
  }
}

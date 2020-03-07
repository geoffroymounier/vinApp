import {
    SET_CELLARS,
    DELETE_CELLARS,
    LOG_OUT
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = null
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function medications(state = initialState, action) {
  let newState;
  switch (action.type) {
    case DELETE_CELLARS:
      if (Array.isArray(action.payload)){
        newState = !state ? [] : [...state]
        for (var i in action.payload){ // or replace certain item in state
          let cellarId = action.payload[i];
          let j = newState.findIndex(m=> (m._id == cellarId));
          if (j != -1) newState.splice(j,1)
        }
      } else {
        newState = (state||[]).filter(m => m._id != action.payload)
      }

      return newState
      break;

    case SET_CELLARS: //filter only carers
      if (state == null || state.length == 0) return action.payload // state init
      else{
        newState = [...state];
        for (var i in action.payload){ // or replace certain item in state
          let cellar = action.payload[i];
          let j = newState.findIndex(m=>m._id == cellar._id);
          if (j!=-1) newState[j]=cellar;
          else newState.push(cellar)
        }
        return newState
      }
      break;
    case LOG_OUT :
      return null
      break;
    default:
      return state
  }
}

import {
    SET_CELLARS
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

const initialState = null
// ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

export default function medications(state = initialState, action) {
  switch (action.type) {
    case 'SET_CELLARS': //filter only carers
      if (state == null || state.length == 0) return action.payload // state init
      else{
        let newState = [...state];
        for (var i in action.payload){ // or replace certain item in state
          let cellar = action.payload[i];
          let j = newState.findIndex(m=>m._id == cellar._id);
          if (j!=-1) newState[j]=cellar;
          else newState.push(cellar)
        }
        return newState
      }
      break;
    default:
      return state
  }
}

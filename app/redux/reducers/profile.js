import {
    ADD_NEW_WINE,
    GET_WINES,
    IS_SEARCHING,
    SAVE_QUERY,
    DISPATCH_MSG,
    SET_USER
  } from "../constants/action-types"; // tous les types d'évenement qui peuvent impacter redux

  const initialState = {
    register:{},
    queryWine:{},
    // wines:{},
    isSearching:false,
    newWine:{isSame:true,wine:{}}
  };
  // ce reducer se charge de traiter les passage à redux lors des evenements sur les vues (react native router flux)

  export default function reducer(state = initialState, action) {

    switch (action.type) {
      case SET_USER:
      return { ...state, user:action.payload}
        break;
      case IS_SEARCHING:
      return { ...state, isSearching:action.payload}
        break;
      case SAVE_QUERY:
      return { ...state, queryWine:action.payload}
        break;
      case ADD_NEW_WINE:
      return { ...state, newWine: action.payload};
        break;
      case GET_WINES:
      return { ...state, wines: action.payload};
        break;
      case DISPATCH_MSG:
      return { ...state, message: action.payload};
        break;
      default:
        return state;
    }
  }

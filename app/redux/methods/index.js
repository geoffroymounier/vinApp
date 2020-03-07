// import {updateProfile,getWines,addMainInfo} from "../actions/index";
// import firebase from 'react-native-firebase';
// import {AsyncStorage} from "react-native"
// import alasql from 'alasql'
//
// this.query = '';
// function getProfile(){
//   return function(dispatch) {
//     firebase.auth().onAuthStateChanged(function (cred) {
//
//       if (cred != null) {
//
//       var user  = cred._user
//       var profile = { // on prepare le jeton redux 'UPDATE_PROFILE' avec les données reccueillies
//               uid: user.uid,
//               email: user.email,
//               emailVerified:user.emailVerified,
//               displayName: user.displayName,
//               photoURL: user.photoURL,
//           }
//       dispatch(updateProfile(profile)); // on propage à redux ce jeton
//     } else {
//       AsyncStorage.removeItem('isUserLogin')
//     }
//     })
//   }
// }
//
// function fetchWines(query){
//   return function(dispatch,getState) {
//     return new Promise((resolve,reject) => {
//       let user = getState().profile.user
//       firebase.database().ref('wines/'+ user.uid  ).on('value',(snap)=>{
//         let wineArray = []
//         snap.forEach(function(childSnapshot) {
//           wineArray.push({...childSnapshot.val(),id:childSnapshot.key});
//         });
//         this.wines = wineArray
//
//         var res = alasql('SELECT * FROM ? ' + this.query,[wineArray]);
//         var wines = getWines(res)
//         dispatch(wines); // on propage à redux ce jeton
//         resolve()
//       })
//     })
//
//   }
//
// }
//
// function queryWines(query = this.query){
//   return function(dispatch) {
//       if (query != this.query) this.query = query
//       let wineArray = this.wines
//       var res = alasql('SELECT * FROM ? ' + query,[wineArray]);
//       var wines = getWines(res)
//       dispatch(wines); // on propage à redux ce jeton
//   }
//
// }
//
//
//
//
// export {getProfile,fetchWines,queryWines}

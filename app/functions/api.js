import {setUser,removeCellars,removeWines,setWines,setCellars,setResults} from '../redux/actions'
import {getCredentials,rememberEmailPassword} from './keychainFunctions'

import io from 'socket.io-client';
const URL = "http://localhost:3001"
let token="";
let accessToken = "";
// var socket;
function deleteToken(){
  console.log("token reset")
  token=""; //lol
  return
}
//
// // function facebookAuth(email,password,qrCodeId){
// //   return new Promise(function(resolve,reject){
// //     fetchData("POST","/registerPatient",{qrCodeId},{email,password})
// //     .then(async function(json){
// //       console.log(json)
// //       await rememberEmailPassword( email, password )
// //       resolve();
// //     })
// //     .catch(e=>reject(e))
// //   })
// // }
//
function textSearch(query = {}){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){

      fetchData("GET","/textSearch/",query)
      .then(array=>{
        dispatch(setResults(array))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function fetchSearch(query = {}){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){

      fetchData("GET","/wines/",query)
      .then(array=>{
        dispatch(setResults(array))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function fetchWines(wineId = '',query = {}){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      fetchData("GET","/wines/" + wineId,query)
      .then(array=>{
        dispatch(setWines(array))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function deleteCellar(cellarArray){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      let body = {cellars:cellarArray}
      fetchData("DELETE","/cellars/",{},body)
      .then(array=>{
        dispatch(removeCellars(cellarArray))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function moveWines(all = false,wineArray,cellarId,newCellarId){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      let params = {}
      let body = {}
      if (all){
        params = {
          allSelect : true,
          cellarId,
          newCellarId
        }
      } else {
        body = {wines:wineArray}
        params = {newCellarId}
      }
      fetchData("PUT","/wines/",params,body)
      .then(array=>{
        dispatch(setWines([array]))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function deleteWine(all = false,wineArray,cellarId){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      let params = {}
      let body = {}
      if (all){
        params = {
          allSelect : true,
          cellarId : cellarId
        }
      } else {
        body = {wines:wineArray}
      }
      fetchData("DELETE","/wines/",params,body)
      .then(array=>{
        if (all) dispatch(removeWines(cellarId))
        else dispatch(removeWines(wineArray))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function saveWine(wine,wineId=''){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      fetchData("POST","/wines/"+wineId,{},wine)
      .then(array=>{
        dispatch(setWines([array]))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function saveCellar(cellar,cellarId=''){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      fetchData("POST","/cellars/"+cellarId,{},cellar)
      .then(array=>{
        dispatch(setCellars([array]))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
function fetchCellars(cellarId=''){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      fetchData("GET","/cellars/"+cellarId)
      .then(array=>{
        console.log(array)
        dispatch(setCellars(array))
        resolve();
      })
      .catch(e=>reject(e))
    })
  }
}
//
// function getPairs(){
//   console.log('getPairs')
//   return function(dispatch) {
//     return new Promise(async function(resolve,reject){
//       fetchData("GET","/cellar")
//       .then(array=>{
//         dispatch(setPairs(array))
//         resolve();
//       })
//       .catch(e=>reject(e))
//     })
//   }
// }
//
function getUser(){
  return function(dispatch) {
    return new Promise(async function(resolve,reject){
      fetchData("GET","/user")
      .then(user=>{
        console.log(user)
        if (!user){
          reject(e) //don't propagate null to redux. the case is treated in front (go to profileForm)
          return;
        }else{
          dispatch(setUser(user));
          resolve(user);
        }
      })
      .catch(e=>reject(e))
    })
  }
}
//
// //eats the wole user ! update redux after
// function updateUser(user){
//   console.log("there")
//   return function(dispatch) {
//     return new Promise(function(resolve,reject){
//       console.log("here")
//       fetchData("POST","/user",{},user)
//       .then(json=>{
//         dispatch(setUser(json.user));
//         resolve(json.user);
//       })
//       .catch(e=>reject(e))
//     })
//   }
// }
//
function login(data){
  return new Promise(async function(resolve,reject){

    //case : login attempt with customs credentials
    let accessToken;
    if (!data) {
    //case : login with credentials stored
      let credentials;
      try{
        credentials = await getCredentials();
        accessToken  = credentials.password
      }catch(e){
        reject("no credentials")
        return;
      }
    } else {
      accessToken  = data.accessToken
    }
    fetchData("GET","/auth/facebook/token",{access_token:accessToken})
    .then(async function(res){
      if (data) await rememberEmailPassword(res.userId,res.accessToken)
      token = res.token;
      socket = io(URL,{
        query : {token},
        secure: true,
        transports: ['websocket'],
      });
      resolve(socket)
      // accessToken = res.token
      // socket = io(URL,{
      //   query : {token},
      //   secure: true,
      //   transports: ['websocket'],
      // });

    })
    .catch(e=>{
      reject(e)
    })
  })
}
//
function fetchData( method, path, params, body){
  return new Promise(function(resolve,reject){
    console.log({token})
    //params json to query
    let query = "";
    if (params && Object.keys(params).length > 0){
      query = "?"+Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
    }
    console.log("fetch  "+method+"  "+URL+ path + query)
    console.log({body:JSON.stringify(body)})

    fetch( URL+ path + query, {
      method: method,
      body: JSON.stringify(body) || "",
      headers: {
        'Content-Type': 'application/json',
        Authorization:"Bearer " + token
      }
    }).then( async function (res){
      console.log(res)
      switch(res.status){
        case 500:
        case 502:
          reject("server error")
          break;
        case 422:
          reject("missing parameters")
          break;
        case 403:     // try login (renew token)
          let credentials;
          try{
            credentials = await getCredentials()
            console.log(credentials)
            await login({accessToken:credentials.password})
            return fetchData(method,path,params,body)
          }catch(e){
            reject("unauthorized, can't re-login")
          }
          break;
        case 404:
          reject("not found")
          break;
        case 401:
          reject("bad password")
          break;
        case 410:
          reject("resource not available anymore")
          break;
        case 200:
          // ALL GOOD CASE
          return res.json() //this is a promise
          break;
        default:
          console.log(res)
          reject("strange error")
          break;
      }
    }).then(json=>resolve(json))
    .catch(e=>{
      console.log("can't perform "+method+", message: "+e)
      reject(e)
      return
    })//end fetch
  })//end promise
}
//
export {moveWines,deleteCellar,deleteWine,textSearch,fetchSearch,fetchCellars,fetchData, login,getUser,saveCellar,saveWine,fetchWines}

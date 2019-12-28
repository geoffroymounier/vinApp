import * as Keychain from 'react-native-keychain';
import {deleteToken} from './api'
import storage from '@react-native-community/async-storage' // defaults to localStorage for web

async function rememberEmailPassword(credentials,type) {
  if (type == 'email'){
    try {
      let username = credentials.email
      let password = credentials.password
      await Keychain.setGenericPassword(
        username,
        password
      );
    } catch (err) {
      console.log(err)
      console.log({ status: 'Could not save credentials, ' + err });
    }
  } else {
    console.log('credentials@'+type,credentials.access_token)
    try {
      await storage.setItem('credentials@'+type,credentials.access_token)
    } catch (err) {
      console.log(err)
      console.log({ status: 'Could not save credentials, ' + err });
    }
  }

}

function getCredentials() {
  return new Promise(async function(resolve,reject){

    try {
      const facebookToken = await storage.getItem('credentials@facebook')
      if (facebookToken) return resolve({accessToken:facebookToken,type:facebook})
      const googleToken = await storage.getItem('credentials@google')
      if (googleToken) return resolve({accessToken:googleToken,type:'google'})
      const credentials = await Keychain.getGenericPassword();
      if (credentials) return resolve({email:credentials.username,password:credentials.password,type:'email'});
      return reject({ status: 'No credentials stored.' });
    } catch (err) {
      reject({ status: 'Could not load credentials. ' + err });
    }
  })
}

async function resetKeychain() {
  try {
    await Keychain.resetGenericPassword();
    await storage.multiRemove(['credentials@google','credentials@facebook'])
    //supprimer le token directement
    console.log({status: 'Credentials Reset!'});
    // deleteToken()
  } catch (err) {
    console.log({ status: 'Could not reset credentials, ' + err });
  }
}

function getBiometryTypes() {
  return new Promise(async function(resolve,reject){
    let biometryTypes;
    try{
      biometryType = await Keychain.getSupportedBiometryType();
      console.log({biometryType})
      resolve(biometryType);
    }catch(e){
      reject(e)
    }
  })
}

export {rememberEmailPassword,getCredentials,resetKeychain,getBiometryTypes}

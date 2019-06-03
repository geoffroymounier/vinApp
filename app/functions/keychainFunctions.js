import * as Keychain from 'react-native-keychain';
import {deleteToken} from './api'

async function rememberEmailPassword(username,password) {
  try {
    await Keychain.setGenericPassword(
      username,
      password,
      //{ accessControl: this.state.accessControl }
    );
  } catch (err) {
    console.log(err)
    console.log({ status: 'Could not save credentials, ' + err });
  }
}

function getCredentials() {
  return new Promise(async function(resolve,reject){
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        resolve(credentials);
      } else {
        reject({ status: 'No credentials stored.' });
      }
    } catch (err) {
      reject({ status: 'Could not load credentials. ' + err });
    }
  })
}

async function resetKeychain() {
  try {
    await Keychain.resetGenericPassword();
    //supprimer le token directement
    console.log({status: 'Credentials Reset!'});
    deleteToken()
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

// import { GoogleSignin } from 'react-native-google-signin';
import React from "react";
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import {AsyncStorage,Linking,Animated,Platform, FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity,Dimensions} from 'react-native';
import {bindActionCreators} from 'redux'
// import {getCredentials,resetKeychain} from '../functions/keychainFunctions'
import {login} from '../functions/api'

import {connect} from 'react-redux'
function mapStateToProps(state){
  return{
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}
const { height, width } = Dimensions.get('window');
async function facebookLogin() {
  try {
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      // handle this however suites the flow of your app
      throw new Error('User cancelled request');
    }

    console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

    // get the access token
    const data = await AccessToken.getCurrentAccessToken();
    await login(data)
    if (!data) {
      // handle this however suites the flow of your app
      throw new Error('Something went wrong obtaining the users access token');
    }
    console.log(data)
    // create a new firebase credential with the token
    // const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

    // login with credential
    // const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

    // console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()))
  } catch (e) {
    console.error(e);
  }
}
class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      opacityValue: new Animated.Value(0),
      opacityText: new Animated.Value(0),
      translateYValue: new Animated.Value(0.1*height),
    };
  }

  componentWillMount(){
    this.start()
  }

  start(){
    Animated.parallel([
      Animated.timing(this.state.opacityValue, {
        toValue: 1, // Animate to final value of 1
        duration:400,
        useNativeDriver:true,
        delay:700
      }),
      Animated.timing(this.state.opacityText, {
        toValue: 1, // Animate to final value of 1
        duration:300,
        useNativeDriver:true,
        delay:0
      }),
      Animated.timing(this.state.translateYValue, {
        toValue: 0,
        duration:500,
        useNativeDriver:true,
        delay:600
      }),
    ]).start();
  }
  render(){
    const { opacityValue, translateYValue , opacityText } = this.state;
    const animatedStyle = {
      opacity: opacityValue,
      transform: [{ translateY: translateYValue }],
    };
    const animatedText = {
      opacity: opacityText
    };
    return (
      <View style={{flex:1}}>
        <View style={{
            flex:1,
            alignSelf:'center',
            width:0.9*width,
            alignItems:'center',
          justifyContent: "center",
        }}>

        <Animated.View style={animatedText} >
        {/* <Image source={require('../assets/aperitif.png')} size={24} color={'#530000'} style={{alignSelf:'center',paddingVertical:5}}/> */}
        <Text style={{fontSize:20,paddingVertical:5,color:'#515151',alignSelf:'center',right:0}}>Bienvenue dans Vinologie !</Text>
        <Text style={{marginVertical:10,fontSize:18,textAlign:'center',paddingVertical:5,color:'#515151',alignSelf:'center',right:0}}>
          L'application qui vous aide à gérer votre cave à vin !
        </Text>

      </Animated.View>
          <Animated.View  style={animatedStyle}>
            <TouchableOpacity onPress={() => facebookLogin()} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:0.9*width,height:50,borderRadius:25,marginBottom:5,backgroundColor:"#530000"}}>
                {/* <Text style={{color:'#FEFDF8',fontWeight:'600',fontSize:16}}>CHERCHER</Text> */}
                {/* <Icon name={'facebook-f'}
                regular
                color={'white'}
                size={26}
                style={{position:'absolute',left:15}}
              /> */}
                <Text style={{color:'#FEFDF8',fontSize:18,fontWeight:"600"}}>Connexion via Facebook</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View  style={animatedStyle}>
            <TouchableOpacity onPress={() => void 0} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:0.9*width,height:50,borderRadius:25,marginBottom:5,backgroundColor:"#530000"}}>
                {/* <Text style={{color:'#FEFDF8',fontWeight:'600',fontSize:16}}>CHERCHER</Text> */}
                {/* <Icon name={'google'}
                regular
                color={'white'}
                size={26}
                style={{position:'absolute',left:10}}
              /> */}
                <Text style={{color:'#FEFDF8',fontSize:18,fontWeight:"600"}}>Connexion via Google</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </View>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Login);

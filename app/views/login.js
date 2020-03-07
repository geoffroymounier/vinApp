import { GoogleSignin,statusCodes } from 'react-native-google-signin';
import React from "react";
import LinearGradient from 'react-native-linear-gradient'
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import {AsyncStorage,Linking,Animated,Platform, FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity,Dimensions} from 'react-native';
import {bindActionCreators} from 'redux'
import {login,testAPI} from '../functions/api'
import { Auth } from 'aws-amplify';

import {connect} from 'react-redux'
function mapStateToProps(state){
  return{
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}
const { height, width } = Dimensions.get('window');

class Login extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    return {
      header: null
    }

  }
  constructor(props){
    super(props)
    this.state = {
      opacityValue: new Animated.Value(0),
      opacityText: new Animated.Value(0),
      translateYValue: new Animated.Value(0.1*height),
    };
  }

  async googleLogin() {

    try {
      const authGoogle = await Auth.federatedSignIn({provider: 'Google'})
      // GoogleSignin.configure();
      // await GoogleSignin.hasPlayServices();
      // const data = await GoogleSignin.signIn();
      // await login(data,'google')
      console.log(authGoogle)
      this.props.navigation.navigate('AuthLoading')
    } catch (error) {

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log(error)
        // some other error happened
      }
    }
  };
  async facebookLogin() {


    try {
      Auth.federatedSignIn({provider: 'Facebook'})
      // const authFacebook= await Auth.federatedSignIn({provider: 'Facebook'})
      // console.log(authFacebook)
      // RNFBSDK  asks the user to authorize and share email and publicprofile
      // const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
      // // refusing to share
      // if (result.isCancelled) {
      //   return
      // }
      // const data = await AccessToken.getCurrentAccessToken();
      // if (!data) {
      //   throw new Error('Something went wrong obtaining the users access token');
      // }
      // await login(data,'facebook')
      // this.props.navigation.navigate('AuthLoading')
    } catch (e) {
      console.error(e);
    }
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
        <LinearGradient
          style={{position:'absolute',
            transform: [
              { translateX: - width * 1.5 },
              // {rotateY : "25deg"},
              {skewX : "-70deg"}
            ],
            width:2*width,height:400,paddingHorizontal:25,paddingBottom:20}}
          start={{x:1, y: 0}}
          end={{x: 0, y: 0.5}} colors={[ '#E02535','#9F041B']}
        />
        <View style={{
            flex:1,
            alignSelf:'center',
            width:0.9*width,
            alignItems:'center',
          justifyContent: "space-around",
        }}>

        <Animated.View style={animatedText} >
        {/* <Image source={require('../assets/aperitif.png')} size={24} color={'#530000'} style={{alignSelf:'center',paddingVertical:5}}/> */}
        <Text style={{fontSize:24,paddingVertical:5,color:'white',alignSelf:'center',right:0,fontWeight:"500"}}>
          Bienvenue dans Vinologie !
        </Text>
      <Text style={{marginVertical:10,fontSize:18,textAlign:'center',paddingVertical:5,color:'white',alignSelf:'center',right:0}}>
          L'application qui vous aide à gérer votre cave à vin !
        </Text>

      </Animated.View>

      <Animated.View style={animatedText} >
        <Image source={require('../assets/aperitif.png')} style={{height:40,width:40}} />

    </Animated.View>
        <View>
          <Animated.View  style={animatedStyle}>
            <TouchableOpacity onPress={() => this.facebookLogin()} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:0.8*width,height:50,borderRadius:25,marginBottom:20,backgroundColor:"#2C54D8"}}>
              <Image source={require('../assets/facebook.png')} style={{position:'absolute',left:15,height:24,width:24,tintColor:'white'}} />
                <Text style={{color:'#FEFDF8',fontSize:18,fontWeight:"600"}}>Facebook</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View  style={animatedStyle}>
            <TouchableOpacity onPress={() => this.googleLogin()} style={{borderColor:"#8C8C8C",borderWidth:1,flexDirection:'row',justifyContent:'center',alignItems:'center',width:0.8*width,height:50,borderRadius:25,marginBottom:20}}>
              <Image source={require('../assets/google.png')} style={{position:'absolute',left:15,height:24,width:24}} />
              <Text style={{color:'#8C8C8C',fontSize:18,fontWeight:"600"}}>Google</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View  style={animatedStyle}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('signUp')} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:0.8*width,height:50,borderRadius:25,backgroundColor:"#D72032"}}>
                <Text style={{color:'#FEFDF8',fontSize:18,fontWeight:"600"}}>Connexion</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:14,textAlign:'center',padding:3,color:'#656565',alignSelf:'center',right:0}}>
            Pas de compte ?
          </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('signIn')}>
            <Text style={{textDecorationLine:'underline', fontSize:14,textAlign:'center',padding:3,color:'#656565',alignSelf:'center',right:0}}>
              Inscrivez vous gratuitement !
            </Text>
          </TouchableOpacity>
        </View>

        </View>
      </View>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Login);

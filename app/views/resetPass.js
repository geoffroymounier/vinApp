import { GoogleSignin,statusCodes } from 'react-native-google-signin';
import React from "react";
import LinearGradient from 'react-native-linear-gradient'
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import {Alert,AsyncStorage,InteractionManager,Linking,Animated,Platform, FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity,Dimensions} from 'react-native';
import {bindActionCreators} from 'redux'
import {resetPass} from '../functions/api'
import {connect} from 'react-redux'
const { height, width } = Dimensions.get('window');


class ResetPass extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      email:''
    };
  }
  prepareResetPass(){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(this.state.email)) return alert("L'email n'est pas correctement écrit")
    resetPass(this.state.email).then((res)=>{
      console.log(res)
    }).catch((err) => {
      switch (err) {
        case 'not found':
          Alert.alert('Impossible de réinitialiser le mot de passe','Aucun E-mail trouvé dans la base pour ce mode de connexion')
          break;
        default:
          alert('Impossible de réinitialiser le mot de passe',err)
          break;
      }
    })
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.emailField.focus()
    })
  }

  render(){


    return (

      <View style={{flex:1}}>

        <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
           style={{flex:1,justifyContent:'center'}}
         >
           <ScrollView
             contentContainerStyle={{flexGrow: 1}}>
             <View style={{
                flex:1,
                alignSelf:'center',
                width:0.9*width,
                alignItems:'center',
                justifyContent: "center",
        }}>
        <View >
          <Text style={{fontSize:24,paddingVertical:5,color:'#434343',textAlign:'center',right:0,fontWeight:"500"}}>
            Mot de passe oublié ?
          </Text>
        {/* <Image source={require('../assets/aperitif.png')} size={24} color={'#530000'} style={{alignSelf:'center',paddingVertical:5}}/> */}
        <Text style={{fontSize:18,paddingVertical:5,color:'#434343',textAlign:'center',right:0,fontWeight:"500"}}>
          Rappelez votre email de connexion
        </Text>
      </View>
        <View >
          <TouchableOpacity onPress={()=>this.emailField.focus()} style={styles.field}>
           <View style={{padding:10}}><Image
             source={require('../assets/email-filled-closed-envelope.png')}
             style={styles.icon}
           /></View>
            <TextInput
              ref={t => this.emailField = t}
               placeholder="E-mail"
               placeholderTextColor="#434343"
              textContentType="emailAddress"
              autoCompleteType="email"
              autoCapitalize={'none'}
              keyboardType="email-address"
              style={styles.input}
              value={this.state.email}
              onChangeText={email => this.setState({ email})}
              underlineColorAndroid="transparent"
            />
          </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <TouchableOpacity onPress={() => this.prepareResetPass()} style={{marginVertical:10,alignSelf:'center',justifyContent:'center',alignItems:'center',width:0.8*width,height:50,borderRadius:25,backgroundColor:"#D72032"}}>
          <Text style={{color:'#FEFDF8',fontSize:18,fontWeight:"600"}}>Réinitialiser</Text>
      </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon : {
    width:30,height:30,tintColor:"#434343"
  },
  input:{
    fontFamily:"ProximaNova-Regular",
    color:"#434343",
    height: 40,
    paddingHorizontal: 5,
    flex:1,
  },
  field: {
    paddingTop:30,
    display:"flex",
    flexDirection:"row",
    width:0.8*width,
    borderBottomColor:'black',
    borderBottomWidth:1,
    alignItems:"center"
  },
});

export default ResetPass;

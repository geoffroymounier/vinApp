import { GoogleSignin,statusCodes } from 'react-native-google-signin';
import React from "react";
import LinearGradient from 'react-native-linear-gradient'
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import {AsyncStorage,Alert,InteractionManager,Linking,Animated,Platform, FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity,Dimensions} from 'react-native';
import {bindActionCreators} from 'redux'
import {login,testAPI} from '../functions/api'
import {connect} from 'react-redux'
const { height, width } = Dimensions.get('window');

function mapStateToProps(state){
  return{
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}


class SignIn extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      email:'',password:'',name:''
    };
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.nameField.focus()
    })
  }
  loginWithCredentials(){

    let {email,password,name} = this.state
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(this.state.email)) return alert("L'email n'est pas correctement écrit")
    login({email,password},'email',name).then((res)=>{
      // this.props.navigation.navigate('signUp')
    }).catch((err) => {
      switch (err) {
        case 'please verify':
          Alert.alert('Verification de l\'email','Vous êtes bien inscrit ! Veuillez à présent valider votre compte via l\'email que nous vous avons envoyé.')
          this.props.navigation.navigate('signUp')
          break;
        case 'unauthorized' :
          Alert.alert('Email déjà Pris','Ce compte est déjà pris ! Veuillez à présent vous authentifier via la page de connexion si vous êtes le propriétaire de cette adresse.')
          break;
        default:
        console.log(err)
          alert('Impossible de vous identifier',err)
        break;
      }
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
        {/* <Image source={require('../assets/aperitif.png')} size={24} color={'#530000'} style={{alignSelf:'center',paddingVertical:5}}/> */}
        <Text style={{fontSize:24,paddingVertical:5,color:'#434343',alignSelf:'center',right:0,fontWeight:"500"}}>
          Inscription à Vinologie
        </Text>
      </View>
        <View >
          <TouchableOpacity onPress={()=>this.nameField.focus()} style={styles.field}>
            <View style={{padding:10}}><Image
              source={require('../assets/user.png')}
              style={styles.icon}
            /></View>
            <TextInput
              ref={t => this.nameField = t}
              placeholder="Votre Nom"
              placeholderTextColor="#434343"
              onSubmitEditing={() => this.emailField.focus()}
              autoCapitalize={'none'}
              style={styles.input}
              value={this.state.name}
              onChangeText={name => this.setState({ name})}
              underlineColorAndroid="transparent"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.emailField.focus()} style={styles.field}>
           <View style={{padding:10}}><Image
             source={require('../assets/email-filled-closed-envelope.png')}
             style={styles.icon}
           /></View>
            <TextInput
              ref={t => this.emailField = t}
               placeholder="Choisissez un E-mail"
               placeholderTextColor="#434343"
              textContentType="emailAddress"
              autoCompleteType="email"
              autoCapitalize={'none'}
              keyboardType="email-address"
              style={styles.input}
              onSubmitEditing={() => this.passField.focus()}
              value={this.state.email}
              onChangeText={email => this.setState({ email})}
              underlineColorAndroid="transparent"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.passField.focus()} style={styles.field}>
            <View style={{padding:10}}><Image
              source={require('../assets/lock.png')}
              style={styles.icon}
            /></View>
            <TextInput
              ref={t => this.passField = t}
             placeholder="Choisissez un mot de passe"
             placeholderTextColor="#434343"
             autoCapitalize={'none'}
              secureTextEntry={true}
              style={styles.input}
              value={this.state.password}
              onChangeText={password => this.setState({ password})}
              underlineColorAndroid="transparent"
            />
          </TouchableOpacity>

        </View>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity onPress={() => this.loginWithCredentials()} style={{marginVertical:10,alignSelf:'center',justifyContent:'center',alignItems:'center',width:0.8*width,height:50,borderRadius:25,backgroundColor:"#D72032"}}>
          <Text style={{color:'#FEFDF8',fontSize:18,fontWeight:"600"}}>Inscription</Text>
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

export default connect(mapStateToProps,matchDispatchToProps)(SignIn);

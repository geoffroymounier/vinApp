import React from "react";
import LinearGradient from 'react-native-linear-gradient'
import {Alert,AsyncStorage,InteractionManager,Linking,Animated,Platform, FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity,Dimensions} from 'react-native';
import {bindActionCreators} from 'redux'
import {login,askForConfirmation} from '../functions/api'
import {connect} from 'react-redux'
const { height, width } = Dimensions.get('window');

function mapStateToProps(state){
  return{
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}


class SignUp extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      email:'',password:''
    };
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.emailField.focus()
    })
  }
  loginWithCredentials(){
    let {email,password} = this.state
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(this.state.email)) return alert("L'email n'est pas correctement écrit")
    login({email,password},'email').then((res)=>{
      this.props.navigation.navigate('AuthLoading')
    }).catch((err) => {
      console.log(err)
      switch (err) {
        case 'wrong password':
          Alert.alert('Connexion impossible','Mauvaise combinaison email/mot de passe')
          break;
        case 'not verified':
          Alert.alert(
          'Verification de l\'email',
          'Votre compte n\'est pas validé ! Veuillez valider votre compte via l\'email que nous vous avons envoyé.',
          [
            {text: 'Renvoyer un mail de confirmation', onPress: () => askForConfirmation(email).then(()=>{
              Alert.alert('Email de confirmation renvoyé')
            })},
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          )
          break;
        case 'no linked account':
          Alert.alert('Connexion Impossible','Mauvaise combinaison email/mot de passe')
          break;
        default:
          Alert.alert('Connexion impossible','Mauvaise combinaison email/mot de passe')
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
            // backgroundColor:'green',
          justifyContent: "center",
        }}>
        <View >
        {/* <Image source={require('../assets/aperitif.png')} size={24} color={'#530000'} style={{alignSelf:'center',paddingVertical:5}}/> */}
        <Text style={{fontSize:24,paddingVertical:5,color:'#434343',alignSelf:'center',right:0,fontWeight:"500"}}>
          Entrez vos identifiants
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
             placeholder="Mot de passe"
             placeholderTextColor="#434343"
             autoCapitalize={'none'}
              secureTextEntry={true}
              style={styles.input}
              value={this.state.password}
              onChangeText={password => this.setState({ password})}
              underlineColorAndroid="transparent"
            />
          </TouchableOpacity>
          <View style={{flexDirection:'row',marginVertical:20,justifyContent:'center'}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('resetPass')}>
              <Text style={{textDecorationLine:'underline', fontSize:14,textAlign:'center',padding:3,color:'#656565',alignSelf:'center',right:0}}>
                Vous avez oublié votre mot de passe ?
              </Text>
            </TouchableOpacity>
          </View>
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

export default connect(mapStateToProps,matchDispatchToProps)(SignUp);

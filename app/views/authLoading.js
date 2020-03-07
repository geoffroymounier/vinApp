import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import {View,Text,ActivityIndicator,Button,Dimensions} from 'react-native'
import styles from '../styles'
import {getUser,fetchCredentials,fetchCellars,login} from '../functions/api'
import {connect} from 'react-redux'
import io from 'socket.io-client';
import { Auth, Hub } from 'aws-amplify';
const { height, width } = Dimensions.get('window');

import {bindActionCreators} from 'redux'

function mapStateToProps(state){
  return{
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({getUser,fetchCellars}, dispatch)
}

class AuthLoading extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    return {
      header:null
    }
  }
  constructor(props) {
    super(props);
    this.state = {loading:true};
    this.socket;
  }
  setSocket(){
    this.socket.on('cellarChanged',(data)=>{
      this.props.fetchCellars(data)
    })
  }
  fetchCred(){
    return new Promise((resolve,reject) => {
      fetchCredentials().then((socket)=>{
          this.socket = socket
          this.props.getUser()
          this.setSocket()
          resolve()
        }).catch(()=>{
          reject()
        })
    })
  }
  async _checkIfAuthenticated() {
    let currentSession = null;
    try {
      currentSession = await Auth.currentSession();
    } catch(err) {
      console.log(err);
    }
    console.log(currentSession)
    this.props.navigation.navigate(currentSession ? 'cellars' : 'login');
  };
  async componentDidMount() { //// AUTH PROCESS
    this._checkIfAuthenticated();
    Hub.listen('auth', async (data) => {
      console.log(data.payload)
      switch (data.payload.event) {

        case 'signIn':
          this.props.navigation.navigate('cellars');
          break;
        case 'signOut':
          this.props.navigation.navigate('login');
          break;
        default:
          break;
      }
    });
    // this.fetchCred().then(()=>{
    //   this.props.navigation.navigate("cellars")
    // }).catch(async e=>{
    //   this.props.navigation.navigate("login")
    // })
  }

  render() {
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
          <View style={styles.container}>
            <ActivityIndicator  />
          </View>
      </View>
    );
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(AuthLoading);

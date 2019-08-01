import React from 'react'
import {View,Text,ActivityIndicator,Button} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import styles from '../styles'
import {getUser,login,fetchCellars} from '../functions/api'
import {connect} from 'react-redux'
import io from 'socket.io-client';


import {bindActionCreators} from 'redux'

function mapStateToProps(state){
  return{
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({getUser,fetchCellars}, dispatch)
}

class AuthLoading extends React.Component {

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
  async componentDidMount() { //// AUTH PROCESS

    console.log('mount AUTH again')
      login().then((socket)=>{
          this.socket = socket
          this.props.getUser()
          this.setSocket()
          this.props.navigation.navigate("cellars")
        }).catch(e=>{                               //can't get user : should be carer
          this.props.navigation.navigate("login")
        })

  }

  render() {
    console.log('HERE')
    return (
      <View style={styles.container}>
          <View style={styles.container}>
            <ActivityIndicator  />
          </View>
      </View>
    );
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(AuthLoading);

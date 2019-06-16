import React from 'react'
import {View,Text,ActivityIndicator,Button} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import styles from '../styles'
import {getUser,login} from '../functions/api'
import {connect} from 'react-redux'


import {bindActionCreators} from 'redux'

function mapStateToProps(state){
  return{
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({getUser}, dispatch)
}

class AuthLoading extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading:true};
  }

  async componentDidMount() { //// AUTH PROCESS


      login().then(()=>{
        // this.props.getUser().then((user)=>{
          this.props.navigation.navigate("cellars")
        }).catch(e=>{                               //can't get user : should be carer
          this.props.navigation.navigate("login")
        })
      // }).catch(e=>{                             //can't log with this keychain
      //   console.log("  can't log: "+e)
      //   console.log("  resetKeychain, to auth")
      //   resetKeychain()
      //   this.props.navigation.navigate("login")
      // })

  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.h2}>Check keychain, try login(), try getUser()</Text> */}
        {/*loading ?*/
          (this.state.loading) ?
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.h2}>Checking credentials</Text>
          </View>
          : null
        }
      </View>
    );
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(AuthLoading);

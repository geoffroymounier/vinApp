import React from 'react'
import {TouchableOpacity, Text,Image} from 'react-native'
import styles from 'styles'

export default class Button extends React.Component {
  constructor(props) {
    //receives props : .content, .onPress, .color
    super(props);
    this.state = {};
  }

  render(){
    return (
      <TouchableOpacity
        onPress={()=>{
          this.props.onPress()
        }}
        style={[styles.listitem]}
      >
        <Text style={styles.h4}>
          {this.props.content}
        </Text>
        <Image source={require("assets/icons/right-chevron.png")} style={{    width: 15,
    height: 15,
    resizeMode: 'contain'}} />
      </TouchableOpacity>
    );
  }
}

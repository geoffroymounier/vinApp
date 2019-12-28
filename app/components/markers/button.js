import React from 'react'
import {TouchableOpacity, Text} from 'react-native'
import styles from 'styles/button'

export default class Button extends React.Component {
  constructor(props) {
    //receives props : .content, .onPress, .color, .style
    super(props);
    this.state = {};
  }

  render(){
    return (
      <TouchableOpacity
        onPress={()=>{
          this.props.onPress()
        }}
        style={this.props.style}
      >
        <Text style={{...styles.button,...this.props.buttonStyle}}>
          {this.props.content}
        </Text>
      </TouchableOpacity>
    );
  }
}

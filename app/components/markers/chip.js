import React from 'react'
import {TouchableOpacity, Text} from 'react-native'

export default class Button extends React.Component {

  render(){
    return (
      <TouchableOpacity
        onPress={()=>{
          this.props.onPress()
        }}
        style={this.props.style}
      >
        <Text style={{}}>
          {this.props.content}
        </Text>
      </TouchableOpacity>
    );
  }
}

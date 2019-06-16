import React from 'react'
import {TouchableOpacity, Image} from 'react-native'
const checked = require('../../assets/checked.png')
const unchecked = require('../../assets/unchecked.png')
export default class Checkbox extends React.Component {
  constructor(props){
    super(props)
  }
  render(){

    return (
      <TouchableOpacity
        onPress={()=>{
          this.props.onPress()
        }}
        style={this.props.style}
      >
        <Image
        style={{
          resizeMode: 'contain',
          height:24
        }}
         source={this.props.checked ? checked : unchecked}
        // style={[styles.button, this.props.color && {backgroundColor:this.props.color}]}
        />

      </TouchableOpacity>
    );
  }
}

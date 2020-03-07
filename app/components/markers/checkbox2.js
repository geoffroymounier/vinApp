import React from 'react'
import {TouchableOpacity, Image,View} from 'react-native'
const checked = require('../../assets/checked.png')
const unchecked = require('../../assets/unchecked.png')
export default class Checkbox extends React.Component {
  constructor(props){
    super(props)
  }
  render(){

    return (
      <TouchableOpacity
        style={{marginHorizontal:10}}
        onPress={()=>{
          this.props.onPress()
        }}
      >
        <View
          style={{
            backgroundColor: this.props.checked ? '#D72032' : 'white',
            borderColor:'#D72032',
            height:24,
            width:24,
            borderRadius:12,
            borderWidth:1,
            }}>
         </View>

      </TouchableOpacity>
    );
  }
}

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
        onPress={()=>{
          this.props.onPress()
        }}
        style={{
          height:30,
          width:30,
          borderRadius:15,
          borderColor:'gray',
          borderWidth:1,
          alignItems:'center',
          justifyContent:'center'
        }}
      >
        <View
          style={{
            backgroundColor: this.props.checked ? '#D72032' : 'white',
            height:28,
            width:28,
            borderRadius:14,
            borderWidth:4,
            borderColor:'white',
            }}>
         </View>
        {/* <Image
        style={{
          resizeMode: 'contain',
          height:24
        }}
         source={this.props.checked ? checked : unchecked}
        // style={[styles.button, this.props.color && {backgroundColor:this.props.color}]}
        /> */}

      </TouchableOpacity>
    );
  }
}

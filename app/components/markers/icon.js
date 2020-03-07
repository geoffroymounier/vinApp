import React from 'react'
import {TouchableOpacity, Image} from 'react-native'
export default class Icon extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    let source = {};
    let icon;
    try {
      // source = `../../assets/+${this.props.name}+.png`
      // let icon = require(this.props.name)
    } catch(e){
      console.log(e)
    }

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
          height:"100%"
        }}

        // source={icon}
        // style={[styles.button, this.props.color && {backgroundColor:this.props.color}]}
        />

      </TouchableOpacity>
    );
  }
}

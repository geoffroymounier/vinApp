import React from 'react'
import {TouchableOpacity, Switch} from 'react-native'

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
        <Switch onValueChange={()=>{
          this.props.onPress()
        }} value={this.props.checked}/>

      </TouchableOpacity>
    );
  }
}

import React from 'react'
import {TouchableOpacity, Image,TextInput} from 'react-native'
const search = require('../../assets/search.png')
export default class SearchBar extends React.Component {
  constructor(props){
    super(props)
  }
  render(){

    return (
      <TouchableOpacity
        onPress={()=>{
          this.textinput.focus()
        }}
        style={{
          flexDirection : 'row',
          padding:10,
          ...this.props.style}}
      >
        <Image
        style={{
          resizeMode: 'contain',
          height:24
        }}
         source={search}
        // style={[styles.button, this.props.color && {backgroundColor:this.props.color}]}
        />
        <TextInput
          ref={t => this.textinput = t}

          onChangeText={(search)=>this.props.onChangeText(search)}
          placeholder='Rechercher'
          underlineColorAndroid='transparent'
          autoCorrect = {false}

          value={this.props.search}

          style={{paddingHorizontal:10,fontSize:18}}
          />
      </TouchableOpacity>
    );
  }
}

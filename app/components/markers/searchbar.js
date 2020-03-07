import React from 'react'
import {TouchableOpacity, Image,TextInput,View} from 'react-native'
import {SafeAreaView} from 'react-navigation'
const search = require('../../assets/search.png')
const times = require('../../assets/times.png')
const filter = require('../../assets/filter.png')
export default class SearchBar extends React.Component {
  constructor(props){
    super(props)
  }
  render(){

    return (
      <SafeAreaView style={{width:"100%"}}>
      <TouchableOpacity
        onPress={()=>{
          this.textinput.focus()
        }}
        style={{
          flexDirection : 'row',
          padding:10,
        }}
      >
        <Image
        style={{
          resizeMode: 'contain',
          height:24
        }}
        onPress={()=>{
          if (this.props.searchClicked) this.props.searchClicked()
        }}
         source={search}
        // style={[styles.button, this.props.color && {backgroundColor:this.props.color}]}
        />
        <TextInput
          ref={t => this.textinput = t}
          onSubmitEditing = {() => this.props.onSubmitEditing ? this.props.onSubmitEditing() : void 0}
          onChangeText={(search)=>this.props.onChangeText(search)}
          placeholder='Rechercher'
          underlineColorAndroid='transparent'
          autoCorrect = {false}
          value={this.props.value}
          style={{paddingHorizontal:10,fontSize:18,flex:1,fontFamily:"ProximaNova-Regular"}}
          />
        {(this.props.value|| '').length > 0 ?
          <TouchableOpacity
            onPress={()=>{
              this.props.onChangeText('')
              this.props.onClear ? this.props.onClear() : void 0
            }}
            style={{
              height:24,
              justifyContent:'center'
          }}>
            <Image

              style={{
                resizeMode: 'contain',
                height:16,
              }}
             source={times}
            />
          </TouchableOpacity>
        : void 0}
        {this.props.filterResults ?
          <TouchableOpacity
            onPress={()=>{
              this.props.toggleSorting()
            }}
            style={{
              height:24,
              paddingRight:5,
              justifyContent:'center'
          }}>
            <Image

              style={{
                resizeMode: 'contain',
                height:20,
              }}
             source={filter}
            />
          </TouchableOpacity>
        : void 0}


      </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

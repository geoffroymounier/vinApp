import React, {Component} from 'react';
import {FlatList,Button,View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Checkbox from '../markers/checkbox.js';
import {SafeAreaView} from 'react-navigation'
import Icon from '../markers/icon.js';
import SearchBar from '../markers/searchbar.js';
import {accordsValues} from '../array/description'
// import alasql from 'alasql'
import {bindActionCreators} from 'redux'
import {setWine,setSearch} from '../../redux/actions'
import {connect} from 'react-redux'
function mapStateToProps(state,props){

  let accordsRaw = accordsValues[props.navigation.getParam('keyValue')].values
  let accords = []
  accordsRaw.forEach((accord,index) => accords.push({
      label : accord,
      key : index
    })
  )
  return{
    accords:accords,
    search : props.navigation.getParam('search') == true,
    selected : state.wine[props.navigation.getParam('keyValue')] || []
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setWine,setSearch}, dispatch)
}
class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.title);
  };

  render() {
    const textColor = this.props.selected ? 'black' : '#4c4c4c';
    return (
      <TouchableOpacity onPress={this._onPress} >
        <View style={{flexDirection:'row',alignItems:'center',borderColor:"lightgray",borderBottomWidth:1,paddingVertical:10}}>
           <Checkbox
             onPress={this._onPress}
            checked={this.props.selected}
          />
          <Text style={{color: textColor}}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}


class Accords extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {search:'',selected: ''};
    this._onPressItem = this._onPressItem.bind(this)

    this.value = props.navigation.getParam('keyValue')
  }


  _keyExtractor = (item, index) => item.key;

  _onPressItem = (label: string) => {

    Keyboard.dismiss()
    if (label == '--- Tout Effacer ---') {
      this.props.search ? this.props.setSearch({[this.value]:[]}) : this.props.setWine({[this.value]:[]})
      return
    }
    let selected = [...this.props.selected]
    let index = selected.findIndex(array => array == label)
    index == -1  ? selected.splice(selected.length, 0,label) : selected.splice(index, 1 )

    this.props.search ? this.props.setSearch({[this.value]:selected}) : this.props.setWine({[this.value]:selected})
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.key}
      onPressItem={this._onPressItem}
      selected={this.props.selected.findIndex(array => array == item.label) > -1}
      title={item.label}
    />
  );

  render() {
    let data = [{label:'--- Tout Effacer ---',key:-1},...this.props.accords.filter(r=>  r.label.toLowerCase().match((this.state.search ||'').toLowerCase()))]

    return (

      <SafeAreaView style={{flex:1}}>
          <View
            style={{

              flexDirection:'row',
              alignItems: "center",
            }}>

            <SearchBar
              searchIcon ={false}
              onChangeText={(search)=>this.setState({search})}
              placeholder='Rechercher'
              underlineColorAndroid='transparent'
              autoCorrect = {false}
              lightTheme
              autoFocus
              value={this.state.search}
              inputContainerStyle={{backgroundColor:'transparent'}}
              containerStyle={{flex:1,backgroundColor:'transparent',borderBottomWidth:0,borderTopWidth:0}}

             />
          </View>
            <FlatList
              data={data}
              keyboardShouldPersistTaps={'always'}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
            <Button
            onPress={() => this.props.navigation.goBack()}
            title="Fermer"
          />
        </SafeAreaView>
    );
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Accords)

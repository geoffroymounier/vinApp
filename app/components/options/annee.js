import React, {Component} from 'react';
import {FlatList,Button,View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Checkbox from '../markers/checkbox.js';
import {SafeAreaView} from 'react-navigation'
import Icon from '../markers/icon.js';
import {makeYearArray} from '../array/pickers'
import {bindActionCreators} from 'redux'
import {setWine,setSearch} from '../../redux/actions'
import {connect} from 'react-redux'
function mapStateToProps(state,props){
  let key = props.navigation.getParam('keyValue')
  return{
    selected : state.wine[key],
    annee : state.wine.annee,
    search : props.navigation.getParam('search') == true,
    apogee : state.wine.apogee
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


class Annee extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {selected: ''};
    this._onPressItem = this._onPressItem.bind(this)
    this.annee = makeYearArray().sort((a,b) => {
      return b.key > a.key ? 1 : -1
    })
    if (props.navigation.getParam('keyValue') == 'annee') {
      let year = new Date(Date.now())
      this.annee = this.annee.filter(y =>  y.key <= year.getFullYear())
    } else if (props.navigation.getParam('keyValue') == 'apogee') {
      this.annee = this.annee.filter(y =>  y.key >= (props.annee || 0))
    } else if (props.navigation.getParam('keyValue') == 'before') {
      this.annee = this.annee.filter(y =>  y.key >= Math.max(props.annee || 0,props.apogee||0))
    }
  }


  _keyExtractor = (item, index) => item.label;

  _onPressItem = (title: string) => {

    Keyboard.dismiss()
    let keyValue = this.props.navigation.getParam('keyValue')

    this.props.search ? this.props.setSearch({[keyValue]:title}) : this.props.setWine({[keyValue]:title})
    this.props.navigation.goBack()
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.key}
      onPressItem={this._onPressItem}
      selected={this.props.selected == item.label}
      title={item.label}
    />
  );

  render() {
    let data = this.annee

    return (

      <SafeAreaView style={{flex:1}}>

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
export default connect(mapStateToProps,matchDispatchToProps)(Annee)

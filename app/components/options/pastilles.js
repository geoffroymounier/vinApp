import React, {Component} from 'react';
import {FlatList,View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Checkbox from '../markers/checkbox2.js';
import Button from '../markers/button.js';
import {SafeAreaView} from '@react-navigation/native'
import Icon from '../markers/icon.js';
import SearchBar from '../markers/searchbar.js';
import {pastillesValues} from '../array/description'
import {bindActionCreators} from 'redux'
import {setWine} from '../../redux/actions'
import {connect} from 'react-redux'
function mapStateToProps(state,props){
  let pastilles = []
  pastillesValues.forEach((c,index) => pastilles.push({key : index,value:c,label:c}))

  return{
    pastilles : pastilles || [],
    selected : state[props.navigation.getParam('search') == true ? 'search' : 'wine']['pastilles'] || []
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setWine}, dispatch)
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


class Country extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {search:'',selected: []};
    this._onPressItem = this._onPressItem.bind(this)

  }


  _keyExtractor = (item, index) => item.key.toString();

  _onPressItem = (label: string) => {

    Keyboard.dismiss()
    if (label == '--- Tout Effacer ---') {
      this.props.setWine({pastilles:[]})
      return
    }
    let selected = [...this.props.selected]
    let index = selected.findIndex(array => array == label)
    index == -1  ? selected.splice(selected.length, 0,label) : selected.splice(index, 1 )
    this.props.setWine({pastilles:selected})
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
      let data = [{label:'--- Tout Effacer ---',value:null,key:-1},...this.props.pastilles]

    return (

      <View style={{flex:1,backgroundColor:'white',paddingTop:30,}}>
            <FlatList
              data={data}
              keyboardShouldPersistTaps={'always'}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
            <Button
                style={{
                  color:'red',
                  margin:10,
                  marginHorizontal:20,
                  height:40,
                  backgroundColor: "#D72032", borderRadius: 20
                }}
                buttonStyle={{
                  fontSize:14,
                  color:'white',
                  backgroundColor:'transparent',
                  padding:0
                }}
              onPress={() => this.props.navigation.goBack()}
              content="Fermer"
            />
      </View>
    );
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Country)

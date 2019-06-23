import React, {Component} from 'react';
import {FlatList,Button,View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Checkbox from '../markers/checkbox.js';
import {SafeAreaView} from 'react-navigation'
import Icon from '../markers/icon.js';
import SearchBar from '../markers/searchbar.js';
import raw from '../array/cepage'
import alasql from 'alasql'
import {bindActionCreators} from 'redux'
import {setWine,setSearch} from '../../redux/actions'
import {connect} from 'react-redux'
function mapStateToProps(state,props){

  let cepages = state.wine.region ? alasql('SELECT DISTINCT cepage, cepage as label  FROM ? WHERE region = "'+state.wine.region+'" ORDER BY cepage ASC ' ,[raw]) :
                    alasql('SELECT DISTINCT cepage, cepage as label FROM ? ORDER BY cepage ASC ' ,[raw])

  cepages.forEach((r,index) => r.key = index.toString())

  return{
    cepages : cepages,
    search : props.navigation.getParam('search') == true,
    selected : state.wine.cepage || []
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setWine,setSearch}, dispatch)
}
class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
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


class Cepage extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {search:'',selected: ''};
    this._onPressItem = this._onPressItem.bind(this)
  }


  _keyExtractor = (item, index) => item.key;

  _onPressItem = (id: string) => {

    Keyboard.dismiss()
    if (id == -1) {
      this.props.search ? this.props.setSearch({cepage:[]}) : this.props.setWine({cepage:[]})
      return
    }
    let selected = [...this.props.selected]
    let index = selected.findIndex(array => array == this.props.cepages[id].cepage)
    index == -1  ? selected.splice(selected.length, 0,this.props.cepages[id].cepage ) : selected.splice(index, 1 )

    this.props.search ? this.props.setSearch({cepage:selected}) : this.props.setWine({cepage:selected})
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.key}
      onPressItem={this._onPressItem}
      selected={this.props.selected.findIndex(array => array == item.cepage) > -1}
      title={item.label}
    />
  );

  render() {
    let data = [{label:'--- Tout Effacer ---',appelation:null,key:-1},...this.props.cepages.filter(r=>  r.cepage.toLowerCase().match((this.state.search ||'').toLowerCase()))]

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
export default connect(mapStateToProps,matchDispatchToProps)(Cepage)

import React, {Component} from 'react';
import {FlatList,View,Button,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Checkbox from '../markers/checkbox.js';
import {SafeAreaView} from 'react-navigation'
import Icon from '../markers/icon.js';
import SearchBar from '../markers/searchbar.js';
import raw from '../array/raw'
import alasql from 'alasql'
import {bindActionCreators} from 'redux'
import {setWine,setSearch} from '../../redux/actions'
import {connect} from 'react-redux'
function mapStateToProps(state,props){

  let regions = !state.wine.country ? alasql('SELECT *, region as label FROM ? GROUP BY region ORDER BY region ASC ' ,[raw]) : alasql('SELECT *, region as label  FROM ? WHERE country = "'+state.wine.country+'" GROUP BY region ORDER BY region ASC ' ,[raw])
  regions.forEach((r,index) => r.key = index)

  return{
    regions : regions,
    search : props.navigation.getParam('search') == true,
    selected : state.wine.region
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


class Region extends React.PureComponent {

  constructor(props){
    super(props)
    this.state = {search:'',selected: ''};
    this._onPressItem = this._onPressItem.bind(this)
    // this.regions = []
  }


  _keyExtractor = (item, index) => item.key;

  _onPressItem = (id: string) => {

    Keyboard.dismiss()
    let newWine = {
      region:(id == -1) ? null : this.props.regions[id].region,
      country : (id == -1) ? null : this.props.regions[id].country,
    }
    this.props.search ? this.props.setSearch(newWine) : this.props.setWine(newWine)
    this.props.navigation.goBack()
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.key}
      onPressItem={this._onPressItem}
      selected={this.props.selected == item.region}
      title={item.label}
    />
  );

  render() {
      let data = [{label:'--- Non Applicable ---',region:null,key:-1},...this.props.regions.filter(r=>  r.region.toLowerCase().match((this.state.search ||'').toLowerCase()))]

    return (

      <SafeAreaView style={{flex:1}}>
          <View
            style={{
              // flex:1,
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
              // showLoading
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
export default connect(mapStateToProps,matchDispatchToProps)(Region)

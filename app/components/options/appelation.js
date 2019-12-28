import React, {Component} from 'react';
import {FlatList,View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Checkbox from '../markers/checkbox2.js';
import Button from '../markers/button.js';
import {SafeAreaView} from 'react-navigation'
import Icon from '../markers/icon.js';
import SearchBar from '../markers/searchbar.js';
import raw from '../array/raw'
import alasql from 'alasql'
import {bindActionCreators} from 'redux'
import {setWine,setSearch} from '../../redux/actions'
import {connect} from 'react-redux'
function mapStateToProps(state,props){
  let {country,region,appelation} = state[props.navigation.getParam('search') == true ? 'search' : 'wine']
  let appelations = country ? alasql('SELECT *, appelation as label  FROM ? WHERE country_code = "'+country+'" ORDER BY appelation ASC ' ,[raw]) :
                    alasql('SELECT *, appelation as label FROM ? ORDER BY appelation ASC ' ,[raw])

  appelations.forEach((r,index) => r.key = index)

  return{
    appelations : appelations,
    search : props.navigation.getParam('search') == true,
    selected : appelation
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


class Appelation extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {search:'',selected: ''};
    this._onPressItem = this._onPressItem.bind(this)
  }


  _keyExtractor = (item, index) => item.key.toString();

  _onPressItem = (id: string) => {

    Keyboard.dismiss()

    let newWine = {
      appelation : (id == -1) ? null : this.props.appelations[id].appelation
    }
    if (id != -1 ) {
      newWine.region = this.props.appelations[id].region
      newWine.country = this.props.appelations[id].country_code
    }

    this.props.search ? this.props.setSearch(newWine) : this.props.setWine(newWine)
    this.props.navigation.goBack()
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.key}
      onPressItem={this._onPressItem}
      selected={this.props.selected == item.appelation}
      title={item.label}
    />
  );

  render() {
      let data = [{label:'--- Non Applicable ---',appelation:null,key:-1},...this.props.appelations.filter(r=>  r.appelation.toLowerCase().match((this.state.search ||'').toLowerCase()))]

    return (

      <View style={{flex:1,backgroundColor:'white',paddingTop:30}}>
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
export default connect(mapStateToProps,matchDispatchToProps)(Appelation)

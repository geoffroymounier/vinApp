import React, {Component} from 'react';
import {FlatList,Image,View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Checkbox from '../markers/checkbox2.js';
import Button from '../markers/button.js';
import {SafeAreaView} from 'react-navigation'
import Icon from '../markers/icon.js';
import SearchBar from '../markers/searchbar.js';
import raw from '../array/raw'
import alasql from 'alasql'
import countryFlags from '../../assets/countries/index.js'
import {bindActionCreators} from 'redux'
import {setWine,setSearch} from '../../redux/actions'
import {connect} from 'react-redux'
function mapStateToProps(state,props){
  let countries =  alasql('SELECT * ,country as label FROM ? GROUP BY country ORDER BY country ASC ' ,[raw])
  countries.forEach((c,index) => c.key = index)

  return{
    countries : countries,
    search : props.navigation.getParam('search') == true,
    selected : state[props.navigation.getParam('search') == true ? 'search' : 'wine'].country
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
          <Image style={{
            marginHorizontal:10,
            height:30,
            width:30,
            borderRadius:15,
            borderColor:'gray',
            borderWidth:1,
            alignItems:'center',
            justifyContent:'center',
            resizeMode: 'contain',
          }} source={countryFlags[this.props.country_code]} />
          <Text style={{color: textColor}}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}


class Country extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {search:'',selected: ''};
    this._onPressItem = this._onPressItem.bind(this)

  }


  _keyExtractor = (item, index) => item.key.toString();

  _onPressItem = (id: string) => {

    Keyboard.dismiss()
    let country = (id == -1) ? null : this.props.countries[id].country_code
    this.props.search ? this.props.setSearch({country}) : this.props.setWine({country})
    this.props.navigation.goBack()
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.key}
      country_code={item.country_code}
      onPressItem={this._onPressItem}
      selected={this.props.selected == item.country}
      title={item.label}
    />
  );

  render() {
      let data = [{label:'--- Non Applicable ---',country:null,key:-1},...this.props.countries.filter(c=>  c.country.toLowerCase().match((this.state.search ||'').toLowerCase()))]
      console.log(data)
    return (

      <View style={{flex:1,backgroundColor:'white',paddingTop:30,}}>
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
export default connect(mapStateToProps,matchDispatchToProps)(Country)

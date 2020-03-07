import React, {Component} from 'react';
import {FlatList,View,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
import Icon from '../markers/icon.js';

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'rgba(0,0,0,0.2)' : '#FEFDF8';
    return (
      <TouchableOpacity onPress={this._onPress} style={{paddingTop:10,backgroundColor:textColor}}>
        <View style={{flexDirection:'row',alignItems:'center',borderColor:"lightgray",borderBottomWidth:1,paddingVertical:10}}>
        <View style={{alignSelf:'flex-end',margin:10,backgroundColor:this.props.color,borderWidth:1,borderColor:'#eee5da',borderRadius:15,width:30,height:30}}></View>
        <Text style={{color: 'black'}}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class MultiSelectList extends React.Component {
  constructor(props){
    super(props)
    this.state = {selected:null};
    this._onPressItem = this._onPressItem.bind(this)
  }
  componentWillMount(){
    this.setState({selected:this.props.data})
  }


  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.props.close(id)
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={this.state.selected == item.id}
      title={item.title}
      color={item.color}
    />
  );

  render() {
      let array = this.props.array
      let data = []
      for (var i in array){
        data.push({title:array[i].region + ' - ' + array[i].appelation,color:array[i].color_code,key:i,id:i})
      }
    return (
      <Modal
        animationType="slide"
        supportedOrientations={["landscape", "portrait"]}
        transparent
        >
          <View style={{
            height:'100%',
            backgroundColor:'rgba(0,0,0,0.8)',
            justifyContent:"center",
          }}>
          <View style={{maxHeight:"80%",backgroundColor:'#FEFDF8'}}>
          <FlatList
            data={data}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
          <TouchableOpacity onPress={() => this.props.close()} >
            <Text
                style={{
                textAlign: "center",
                padding: 20,
                fontWeight: "bold",
                fontSize: 16
            }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    );
  }
}

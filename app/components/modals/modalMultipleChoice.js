import React, {Component} from 'react';
import {FlatList,View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Modal,ScrollView,Text,Dimensions} from 'react-native';
// import {Checkbox} from 'react-native-paper'
// import {SearchBar} from 'react-native-elements'
import Icon from '../markers/icon.js';

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'black' : '#4c4c4c';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={{flexDirection:'row',alignItems:'center',borderColor:"lightgray",borderBottomWidth:1,paddingVertical:10}}>
          {/* <Checkbox
            color={textColor}
            status={this.props.selected  ? 'checked' : 'unchecked'}
          /> */}
          <Text style={{color: textColor}}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class MultiSelectList extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {search:'',selected: (new Map(): Map<string, boolean>)};
    this._onPressItem = this._onPressItem.bind(this)
  }
  componentWillMount(){
        let selected = new Map();
        for (let k of this.props.data) {
            selected.set(k, true);
        }
        this.setState({selected})
  }
  // componentWillReceiveProps(){
  //       let selected = new Map();
  //       for (let k of props.data) {
  //           selected.set(k, true);
  //       }
  //       this.setState({selected})
  // }

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    Keyboard.dismiss()
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
      let array = this.props.array
      let data = []
      for (var i in array){
        if ((array[i] || '').toLowerCase().match((this.state.search ||'').toLowerCase())) (data.push({title:array[i],key:i,id:i}))
      }

    return (

        <Modal

          animationType="slide"
          supportedOrientations={["landscape", "portrait"]}
          >
          <View  style={{flexDirection:'row',

            alignItems: "center",
            marginTop: 60,
          }}>
          <TouchableOpacity onPress={() => {
              let obj = {}
              for (let [k,v] of this.state.selected) {
                if (v) obj[k] = v;
              }
              this.props.close(Object.keys(obj))}}>
            <Icon
                 style={{
                   marginHorizontal:10,
                   backgroundColor:'transparent'
                 }}
                 name="chevron-circle-left"
                 type="font-awesome"
                 color={'#eee5da'}
                 size = {28}

             />
          </TouchableOpacity>
            {/* <SearchBar
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

             /> */}
          </View>

          <ScrollView

             onScroll={Keyboard.dismiss}
             keyboardShouldPersistTaps={'always'}
             >

           {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}
             style={{borderColor:"lightgray",borderBottomWidth:1}}>


            <Text style={{
                paddingVertical:20,
              textAlign: "center",
              paddingTop: 5,
              fontWeight: "bold",
              fontSize: 18,

            }}>
              Choisissez un ou plusieurs items
            </Text>
          </TouchableWithoutFeedback> */}

            <FlatList

              data={data}
              keyboardShouldPersistTaps={'always'}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />

          </ScrollView>

          <View style={{position:'absolute',zIndex:3,bottom:0,left:0,width:'100%',height:60,flex:1,backgroundColor:'#eee5da'}}>
          <TouchableOpacity onPress={() => {
              let obj = {}
              for (let [k,v] of this.state.selected) {
                if (v) obj[k] = v;
              }
              this.props.close(Object.keys(obj))}} >
            <Text
                style={{
                textAlign: "center",
                padding: 10,
                fontWeight: "bold",
                fontSize: 16,
                color:"#4c4c4c"
            }}>Fermer</Text>
          </TouchableOpacity>
          </View>

        </Modal>


    );
  }
}

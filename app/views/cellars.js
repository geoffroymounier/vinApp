import React, {Component} from 'react';
// import {Actions} from 'react-native-router-flux'
import {Animated,Dimensions,ActivityIndicator,InteractionManager,Easing,Platform,ActionSheetIOS,Alert,FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import {Chip} from 'react-native-paper';
// import RNPickerSelect from 'react-native-picker-select';
// import ManagePhoto from '../components/modals/managePhoto'
// import firebase from 'react-native-firebase';
import messages from '../components/texts/'
import Button from '../components/markers/button'
// import { Searchbar } from 'react-native-paper';
// import {carafageArray,makeRegionArray,makeStockArray,makeYearArray} from '../components/array/pickers'
// import {caracteristiques,colors,cepageValues,dialog,json,regions} from '../components/array/description'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchCellars} from '../functions/api'
import {setCellar,resetCellar} from '../redux/actions'

const { height, width } = Dimensions.get('window');

function mapStateToProps(state){
  return {
    cellars : state.cellars,
    // user : state.profile.user,
    // message : state.profile.message,
    // isSearching:state.profile.isSearching || Object.keys(state.profile.querycelar || {}).length > 0
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({fetchCellars,setCellar,resetCellar},dispatch)
}


class MyListItem extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      width: new Animated.Value(0),
      opacityValue: new Animated.Value(0),
      opacityText: new Animated.Value(0),
      translateYValue: new Animated.Value(-0.1*height),
    };
  }
  componentWillMount(){
    this.start()
  }
  _onPress = () => {

    this.selectIt(1,()=>{
      this.selectIt(0,()=> void 0)
      this.props.onPressItem(this.props.id)
      this.selectIt(0,()=> void 0)
    })
  };

  selectIt(value,callback){
    Animated.timing(this.state.width,{
      toValue: value,
      duration: 150,
      easing : Easing.linear
    }).start(()=>callback())
  }
  start(){
    Animated.parallel([
      Animated.timing(this.state.opacityValue, {
        toValue: 1, // Animate to final value of 1
        duration:150,
        useNativeDriver:true,
        delay:300
      }),
      Animated.timing(this.state.opacityText, {
        toValue: 1, // Animate to final value of 1
        duration:150,
        useNativeDriver:true,
        delay:0
      }),
      Animated.timing(this.state.translateYValue, {
        toValue: 0,
        duration:200,
        useNativeDriver:true,
        delay:300
      }),
    ]).start();
  }
  render() {
    const { opacityValue, translateYValue , opacityText } = this.state;
    const animatedStyle = {
      opacity: opacityValue,
      transform: [{ translateY: translateYValue }],
    };
    const animatedText = {
      opacity: opacityText
    };
    const width = this.state.width.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    })
    this.selectIt(0, ()=> void 0)
    let favorite = this.props.favorite

    return (

      <Animated.View  style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={()=>this.selectIt(1,()=> void 0)}
        onLongPress={() => {
          this.props.manageItem(this.props.id)
          this.selectIt(0,() => void 0)
        }}
        onPress={this._onPress}
        >
        <Animated.View style={{position:'absolute',zIndex:10,backgroundColor: 'lightgray', opacity: 0.2, height:"100%", width: width }}/>
        <View style={{width:'100%',backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderColor:"lightgray",borderBottomWidth:1,padding:10}}>

        <View style={{flexDirection:'row',alignItems:'center',flex:6}}>
          <View style={{borderWidth:1,borderColor:'#bababa',borderRadius:15,width:30,height:30}}>
          </View>

          <View style={{paddingHorizontal:10,alignSelf:'baseline',flex:1,flexDirection:'column'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.title}>{this.props.name}</Text>
              {favorite ?
                  <View style={{marginLeft:10,alignSelf:'center'}}>
                    <Icon name={'heart'}
                    regular={favorite!=true}
                    color={favorite ? 'pink' : 'darkgray'}
                    solid={favorite==true}
                    size={20}
                  />
                  </View>

              : void 0}
            </View>
            <Text style={styles.domain}>{this.props.description} </Text>
          </View>

        </View>
        <View style={{flex:1,alignItems:'flex-start'}}>
          <Text style={{alignSelf:'baseline',flexWrap: "wrap",width:50,textAlign:'center'}}>{this.props.price ? this.props.price + '€':''}</Text>
          <Text style={{alignSelf:'baseline',flexWrap: "wrap",width:50,textAlign:'center'}}>{this.props.stock +' bts'}</Text>
        </View>

        </View>

      </TouchableOpacity>
      </Animated.View>
    );
  }
}

class Cellars extends React.Component {
  constructor(props){
    super(props)
    this.state = {firstQuery:'',refreshing:true}
    this._onPressItem = this._onPressItem.bind(this)
    this.manageItem = this.manageItem.bind(this)
  }
  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    this.props.setCellar(this.props.cellars[id])
    this.props.navigation.push('wines')
    // Actions.fiche({
    //       id:id,
    //       celar:this.props.[id],
    //     });

    // updater functions are preferred for transactional updates
  };

  componentDidMount(){
    this.props.fetchCellars().then(()=>this.setState({refreshing:false}))
  }
  _renderItem = ({item}) => (
    <MyListItem
      onPressItem={this._onPressItem}
      manageItem={this.manageItem}
      {...item}
    />
  );

  manageItem(id) {
    // ActionSheetIOS.showActionSheetWithOptions({
    //     options: ['Supprimer','Annuler'],
    //     destructiveButtonIndex:0
    //   }, (index) => {
    //     if (index == 0 ){
    //       firebase.database().ref('//'+ this.props.user.uid + '/'+ this.props.[id].id).remove()
    //     } else {
    //       return
    //     }
    //
    //     // Do something with result
    //   })
  }
  render(){
    const { firstQuery } = this.state;
    console.log(this.props.cellars)
    if (!this.props.cellars) return (
      <View style={{justifyContent:'center',flex:1}}>

        <ActivityIndicator />

      </View>)
    let cellars = []
    Object.keys(this.props.cellars).map((e,i)=>{
      let celar = this.props.cellars[e]
      if (!celar) return null
      cellars.push({
        id:i.toString(),
        key: celar.id,
        name:celar.name,
        description:celar.description
      })
    })

    return(
      <View style={{flex:1}}>

        <View style={{
            flex:1,
          backgroundColor: "transparent",
          justifyContent: "center",
          justifyContent:"flex-start",
        }}>

        <FlatList
          refreshing={this.state.refreshing}

          data={cellars}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={
            this.props.isSearching == true ? void 0 :
            <View style={{alignItems:'center',justifyContent:'center',flex:1,marginVertical:30,padding:10}}>
              <Text style={{...styles.title,textAlign:'center',marginVertical:20}}>
                {messages.emptyCave}
              </Text>
            <TouchableOpacity style={{width:'100%',justifyContent:'center',height:50,borderRadius:25,backgroundColor:'#530000'}} onPress={()=>this.props.navigation.push('editCellar')} >
                <Text
                    style={{
                    textAlign: "center",
                    padding: 10,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16
                }}>Ajouter une nouvelle Cave !</Text>
              </TouchableOpacity>
            </View>

          }
        />

        </View>
        <Button content='Ajouter une Cave' onPress={()=>{
            this.props.resetCellar()
            this.props.navigation.push('editCellar')
          }} />
  </View>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Cellars)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  label:{
    alignSelf:'center',
    fontSize: 20,
    textAlign: 'left',
    marginRight:20,
  },
  textInputPicker:{
    color:'#262626',
    padding:10,
    paddingBottom:8,
    fontSize:16,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center'
  },
  textInput:{
    borderWidth:0,

    borderColor:'transparent'
  },
  chip:{
    margin:5,
  },
  title: {
    fontSize: 20,
    fontWeight:"600",
    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  domain: {
    fontSize: 18,

    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  appelation: {
    color:"#262626",
    fontWeight:"800",
    fontSize: 24,
    alignSelf:'flex-start',
    textAlign: 'left',
    margin: 10,
  },
  undertitle: {
    fontSize: 16,
    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

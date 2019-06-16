import React, {Component} from 'react';
// import {Actions} from 'react-native-router-flux'
import {Animated,Dimensions,ActivityIndicator,InteractionManager,Easing,Platform,ActionSheetIOS,Alert,FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import {Chip} from 'react-native-paper';
// import RNPickerSelect from 'react-native-picker-select';
// import ManagePhoto from '../components/modals/managePhoto'
// import firebase from 'react-native-firebase';
import Button from '../components/markers/button'
import messages from '../components/texts/'
// import { Searchbar } from 'react-native-paper';
// import {carafageArray,makeRegionArray,makeStockArray,makeYearArray} from '../components/array/pickers'
import {caracteristiques,colors,cepageValues,dialog,json,regions} from '../components/array/description'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchWines} from '../functions/api'
import {setWine,resetWine} from '../redux/actions'

const { height, width } = Dimensions.get('window');

function mapStateToProps(state,props){
  return {
    wines : (state.wines||[]).filter(w => w.cellarId == state.cellar._id),
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({fetchWines,setWine,resetWine},dispatch)
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
    let cepage = []
    this.props.cepage.map((c) => {
      cepage.push((cepageValues.values[c]))
    })
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
          <View style={{backgroundColor:(colors[this.props.color] ? colors[this.props.color].color : 'black' ),borderWidth:1,borderColor:'#bababa',borderRadius:15,width:30,height:30}}>
          </View>

          <View style={{paddingHorizontal:10,alignSelf:'baseline',flex:1,flexDirection:'column'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.title}>{this.props.appelation}</Text>
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




            <Text style={styles.domain}>{this.props.region || ''} {this.props.annee || ''}</Text>
            {this.props.domain && this.props.domain != '' ? <Text style={styles.domain}>{this.props.domain} </Text> : void 0}
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

class Wines extends React.Component {
  constructor(props){
    super(props)
    this.state = {firstQuery:'',refreshing:true}
    this._onPressItem = this._onPressItem.bind(this)
    this.manageItem = this.manageItem.bind(this)
  }
  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    this.props.resetWine()
    this.props.setWine(this.props.wines[id])
    this.props.navigation.push('editWine')

    // Actions.fiche({
    //       id:id,
    //       wine:this.props.wines[id],
    //     });

    // updater functions are preferred for transactional updates
  };

  componentDidMount(){
    this.props.fetchWines().then(()=>this.setState({refreshing:false}))
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
    //       firebase.database().ref('/wines/'+ this.props.user.uid + '/'+ this.props.wines[id].id).remove()
    //     } else {
    //       return
    //     }
    //
    //     // Do something with result
    //   })
  }
  render(){
    const { firstQuery } = this.state;
    if (!this.props.wines) return (
      <View style={{justifyContent:'center',flex:1}}>

        <ActivityIndicator />

      </View>)
    let wines = []
    Object.keys(this.props.wines).map((e,i)=>{
      let wine = this.props.wines[e]
      if (!wine) return null
      wines.push({
        id:i.toString(),
        key: wine.id,
        color:wine.color,
        stock:wine.stock,
        price:wine.price,
        appelation:wine.appelation,
        domain:wine.domain,
        annee:wine.annee,
        favorite:wine.favorite,
        region:wine.region,
        cepage:wine.cepage || []
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

          data={wines}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={
            this.props.isSearching == true ? void 0 :
            <View style={{alignItems:'center',justifyContent:'center',flex:1,marginVertical:30,padding:10}}>
              <Text style={{...styles.title,textAlign:'center',marginVertical:20}}>
                {messages.emptyCave}
              </Text>
            <TouchableOpacity style={{width:'100%',justifyContent:'center',height:50,borderRadius:25,backgroundColor:'#530000'}} onPress={()=>{
                this.props.resetWine()
                this.props.navigation.push('editWine')
              }} >
                <Text
                    style={{
                    textAlign: "center",
                    padding: 10,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16
                }}>Ajouter un nouveau Vin !</Text>
              </TouchableOpacity>
            </View>

          }
        />

        </View>
        <Button content='Ajouter un Vin' onPress={()=>{
            this.props.resetWine()
            this.props.navigation.push('editWine')
          }} />
  </View>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Wines)
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

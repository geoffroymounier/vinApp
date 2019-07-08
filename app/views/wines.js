import React, {Component} from 'react';
// import {Actions} from 'react-native-router-flux'
import {Animated,Button,Dimensions,ActivityIndicator,InteractionManager,Easing,Platform,ActionSheetIOS,Alert,FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,PickerIOS,TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import {Chip} from 'react-native-paper';
// import RNPickerSelect from 'react-native-picker-select';
// import ManagePhoto from '../components/modals/managePhoto'
import SearchBar from '../components/markers/searchbar';
import Checkbox from '../components/markers/checkbox';
import ButtonCustom from '../components/markers/button'
import messages from '../components/texts/'
const heartFull = require('../assets/heart-full.png')
// import {carafageArray,makeRegionArray,makeStockArray,makeYearArray} from '../components/array/pickers'
import {caracteristiques,colors,cepageValues,dialog,json,regions} from '../components/array/description'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchWines,textSearch,deleteWine,fetchSearch} from '../functions/api'
import {setWine,resetWine,resetResults,setSearch,resetSearch} from '../redux/actions'

const { height, width } = Dimensions.get('window');

function mapStateToProps(state,props){
  let wines = (Object.keys(state.search||{}).length) == 0 ? !state.wines ? null : (state.wines||[]).filter(w => w.cellarId == state.cellar._id)
  : !state.results ? null : (state.results).filter(w => w.cellarId == state.cellar._id)
  let keyOrder = ((state.search||{}).keyOrder) || 'region'
  let order = ((state.search||{}).order) || 1
  return {
    search : state.search||{},
    wines : wines == null ? null : (wines).sort((a,b) => {
      return a[keyOrder] > b[keyOrder] ? order : -1*order
    }),
    cellarId : state.cellar._id,
    isSearching : Object.keys(state.search||{}).length > 0,
    activeSelection : props.navigation.getParam('activeSelection') == true,
    showPicker : props.navigation.getParam('showPicker') == true
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({fetchSearch,fetchWines,deleteWine,resetSearch,setWine,setSearch,resetWine,textSearch,resetResults},dispatch)
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
      this.props.activeSelection ? this.props.toggleSelect(this.props._id) : this.props.onPressItem(this.props.id)
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
          <View style={{backgroundColor:(colors[this.props.color] ? colors[this.props.color].color : 'black' ),borderWidth:1,borderColor:'#bababa',borderRadius:15,width:30,height:30}}></View>

          <View style={{paddingHorizontal:10,alignSelf:'baseline',flex:1,flexDirection:'column'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.title}>{this.props.appelation}</Text>
              {favorite ?
                  <View>
                    <Image style={{
                      resizeMode: 'contain',
                      height:20
                    }} source={heartFull} />
                  </View>
              : void 0}
            </View>
            <Text style={styles.domain}>{this.props.region || ''}</Text>
            {this.props.annee ? <Text style={styles.domain}>{this.props.annee || ''}</Text> : void 0}
            {this.props.domain && this.props.domain != '' ? <Text style={styles.domain}>{this.props.domain} </Text> : void 0}
          </View>

        </View>
        {this.props.activeSelection ?
          <Checkbox
           onPress={this._onPress}
           checked={this.props.selected}
         />
        :
        <View style={{flex:1,alignItems:'flex-start'}}>
          <Text style={{alignSelf:'baseline',flexWrap: "wrap",width:50,textAlign:'center'}}>{this.props.price ? this.props.price + '€':''}</Text>
          <Text style={{alignSelf:'baseline',flexWrap: "wrap",width:50,textAlign:'center'}}>{this.props.stock +' bts'}</Text>
        </View>
        }


        </View>

      </TouchableOpacity>
      </Animated.View>
    );
  }
}

class Wines extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    const { params = {} } = navigation.state;
    if (params.activeSelection) return {
    headerLeft:
    (<Button
      onPress={() => navigation.setParams({activeSelection:false})}
      title={"Annuler"}
    />),
    headerRight: params.selected > 0 ?
    (<Button
      onPress={() => navigation.setParams({showPicker:true})}
      title={"Options"}
    />) : void 0
  }
  return {headerTitle : navigation.getParam('cellarName')}
  }
  constructor(props){
    super(props)
    this.state = {firstQuery:'',refreshing:true,limit:10,selected:[]}
    this._onPressItem = this._onPressItem.bind(this)
    this.manageItem = this.manageItem.bind(this)
  }
  _keyExtractor = (item, index) => item.key;

  _onPressItem = (id: string) => {
    this.props.resetWine()
    this.props.setWine(this.props.wines[id])
    this.props.navigation.push('ficheWine',{color:this.props.wines[id].color})
  };

  componentDidMount(){
    this.props.fetchWines('',{keyOrder:this.props.search.keyOrder || 'region',order:(this.props.search.order || 1),cellarId :this.props.cellarId,limit:this.state.limit}).then(()=>this.setState({refreshing:false}))
  }
  _renderItem = ({item}) => (
    <MyListItem
      toggleSelect = {(id)=>{
        let selected = [...this.state.selected]
        let index = selected.findIndex(array => array == id)
        index == -1  ? selected.splice(selected.length, 0,id ) : selected.splice(index, 1 )
        this.props.navigation.setParams({selected:selected.length})
        this.setState({selected})
      }}
      activeSelection = {this.props.activeSelection}
      selected = {this.state.selected.findIndex(array => array == item._id) > -1}
      onPressItem={this._onPressItem}
      manageItem={this.manageItem}

      {...item}
    />
  );

  manageItem(id) {

  }
  render(){

    let keyOrder = this.props.search.keyOrder || 'region'
    let orderString = (this.props.search.order || 1) == 1 ? ' (décroissant)' : ' (croissant)'
    let order = this.props.search.order || 1

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
        _id: wine._id.toString(),
        color:wine.color,
        stock:wine.stock || 0,
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
        {this.props.activeSelection ?
          <TouchableOpacity onPress={()=>{
            let selected = this.state.allSelect ? [] : this.props.wines.map(w => w._id);
            this.props.navigation.setParams({selected:selected.length})
            this.setState({selected,allSelect:!this.state.allSelect})
          }} >
            <View style={{flexDirection:'row',alignItems:'space-between',borderColor:"lightgray",borderBottomWidth:1,padding:10}}>

              <Text style={{paddingHorizontal:10,fontSize:18,flex:1}}>Tout Selectionner</Text>
              <Checkbox
                onPress={()=>{
                  let selected = this.state.allSelect ? [] : this.props.wines.map(w => w._id);
                  this.props.navigation.setParams({selected:selected.length})
                  this.setState({selected,allSelect:!this.state.allSelect})
                }}
               checked={this.state.allSelect}
             />
            </View>
          </TouchableOpacity>
          :
          <SearchBar
            searchIcon ={false}
            onChangeText={(search)=>this.setState({search})}
            placeholder='Rechercher'
            underlineColorAndroid='transparent'
            autoCorrect = {false}
            filterResults
            onSubmitEditing = {()=> {
              if ((this.state.search || '').length  == 0 ) return
              this.props.resetResults()
              this.props.setSearch({search:this.state.search})
              this.props.textSearch({search:this.state.search})
            }}
            onClear = {()=>{
              this.props.resetSearch()
              this.props.resetResults()
            }}
            toggleSorting={()=>this.setState({showSorting:true})}
            lightTheme
            autoFocus
            value={this.state.search}
            inputContainerStyle={{backgroundColor:'transparent'}}
            containerStyle={{flex:1,backgroundColor:'transparent',borderBottomWidth:0,borderTopWidth:0}}
           />
        }
        {this.props.showPicker == true ?
          ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Annuler', 'Supprimer' , 'Déplacer de Cave'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            this.props.navigation.setParams({showPicker:false})
            if (buttonIndex === 1) {

              this.state.allSelect ? this.props.deleteWine(true,[],this.props.wines[0].cellarId) : this.props.deleteWine(false,this.state.selected,this.props.wines[0].cellarId)
              this.setState({selected:[]})
              this.props.navigation.setParams({showPicker:false,activeSelection:false,selected:0})

            } else if (buttonIndex === 2) {
              this.props.navigation.push('choseCellar',{all:this.state.allSelect,selected:this.state.selected,cellarId:this.props.wines[0].cellarId})
              this.props.navigation.setParams({showPicker:false,activeSelection:false,selected:0})
            }
          },
        )
        : void 0}
        {this.state.showSorting == true ?
          ActionSheetIOS.showActionSheetWithOptions(
          {
            title:'Tri :',
            options: [
             'Annuler',
             'Millesime' + ((keyOrder == 'year') ?  orderString : ''),
             'Region' + ((keyOrder == 'region') ? orderString : ''),
             'Couleur' + ((keyOrder == 'color') ? orderString  : ''),
             'Prix' + ((keyOrder == 'price') ? orderString  : '')
           ],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            this.setState({showSorting:false})
            let newOrder;
            let newKeyOrder;
            if (buttonIndex === 1) {
              newKeyOrder = 'year'
              newOrder = (keyOrder == 'year' && order == 1) ? -1 : 1
            } else if (buttonIndex === 2) {
              newKeyOrder = 'region'
              newOrder = (keyOrder == 'region' && order == 1) ? -1 : 1
            } else if (buttonIndex === 3){
              newKeyOrder = 'color'
              newOrder = (keyOrder == 'color' && order == 1) ? -1 : 1
            } else if (buttonIndex === 4){
              newKeyOrder = 'price'
              newOrder = (keyOrder == 'price' && order == 1) ? -1 : 1
            }
            this.props.resetResults()
            this.props.setSearch({order:newOrder,keyOrder:newKeyOrder})
            setTimeout(()=>this.props.fetchSearch(this.props.search),500)
          },
        )
        : void 0}
        <FlatList
          refreshing={this.state.refreshing}
          onEndReached = {()=>{
            this.props.fetchWines('',{cellarId:this.props.cellarId,keyOrder:this.props.search.keyOrder || 'region',order:(this.props.search.order || 1), limit:this.state.limit+10}).then(()=>this.setState({limit:this.state.limit+10}))
          }}
          data={wines}
          keyExtractor={this._keyExtractor}
          onEndReachedThreshold={0.01}
          renderItem={this._renderItem}
          ListEmptyComponent={
            this.props.isSearching == true ?
            <View style={{alignItems:'center',justifyContent:'center',flex:1,marginVertical:30,padding:10}}>
              <Text style={{...styles.title,textAlign:'center',marginVertical:20}}>
                Aucun Resultat
              </Text>
            </View>
            :
            <View style={{alignItems:'center',justifyContent:'center',flex:1,marginVertical:30,padding:10}}>
              <Text style={{...styles.title,textAlign:'center',marginVertical:20}}>
                {messages.emptyCave}
              </Text>
            <TouchableOpacity style={{width:'100%',justifyContent:'center',height:50,borderRadius:25,backgroundColor:'#530000'}} onPress={()=>{
                this.props.resetWine()
                this.props.navigation.push('ficheWine')
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
        <ButtonCustom content='Ajouter un Vin' onPress={()=>{
            this.props.resetWine()
            this.props.navigation.push('ficheWine')
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

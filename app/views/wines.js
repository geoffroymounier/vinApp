import React, {Component} from 'react';
import WineItem from '../components/list/wineItem'
import SelectBar from '../components/markers/selectBar'
import {Animated,Button,Dimensions,ActivityIndicator,InteractionManager,Easing,Platform,ActionSheetIOS,Alert,FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,PickerIOS,TouchableOpacity} from 'react-native';
import SearchBar from '../components/markers/searchbar';
import Checkbox from '../components/markers/checkbox';
import ButtonCustom from '../components/markers/button'
import messages from '../components/texts/'
const heartFull = require('../assets/heart-full.png')
const glassWine = require('../assets/glass-wine.png')
const bottle = require('../assets/bottle.png')
// import {caracteristiques,colors,cepageValues,dialog,json,regions} from '../components/array/description'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchWines,textSearch,deleteWine,fetchSearch} from '../functions/api'
import {setWine,resetWine,resetResults,setSearch,resetSearch} from '../redux/actions'


function mapStateToProps(state,props){
  let wines = (Object.keys(state.search||{}).length) == 0 ? !state.wines ? null : (state.wines||[]).filter(w => w.cellarId == state.cellar._id)
  : !state.results ? null : (state.results).filter(w => w.cellarId == state.cellar._id)
  let keyOrder = ((state.search||{}).keyOrder) || 'region'
  let order = ((state.search||{}).order) || 1
  return {
    search : state.search||{},
    wines : wines == null ? null : (wines).sort((a,b) => a[keyOrder] > b[keyOrder] ? order : -1*order),
    cellarId : state.cellar._id,
    isSearching : Object.keys(state.search||{}).length > 0,
    activeSelection : props.navigation.getParam('activeSelection') == true,
    showPicker : props.navigation.getParam('showPicker') == true
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({fetchSearch,fetchWines,deleteWine,resetSearch,setWine,setSearch,resetWine,textSearch,resetResults},dispatch)
}

class Wines extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    const { params = {} } = navigation.state;
    if (params.activeSelection) return {
    headerLeft:
    (<Button
      color='white'
      onPress={() => navigation.setParams({activeSelection:false})}
      title={"Annuler"}
    />),
    headerRight: params.selected > 0 ?
    (<Button
      color='white'
      onPress={() => navigation.setParams({showPicker:true})}
      title={"Options"}
    />) : void 0
  }
  return {headerTitle : navigation.getParam('cellarName')}
  }
  constructor(props){
    super(props)
    this.state = {refreshing:true,limit:10,selected:[]}
    this._onPressItem = this._onPressItem.bind(this)
  }
  _keyExtractor = (item, index) => item.key;

  _onPressItem = (id: string) => {
    this.props.resetWine()
    this.props.setWine(this.props.wines[id])
    this.props.navigation.navigate('ficheWine',{color:this.props.wines[id].color})
  };

  componentDidMount(){
    this.props.fetchWines('',{keyOrder:this.props.search.keyOrder || 'region',order:(this.props.search.order || 1),cellarId :this.props.cellarId,limit:this.state.limit}).then(()=>this.setState({refreshing:false}))
  }
  _renderItem = ({item}) => (
    <WineItem
      toggleSelect = {(id)=>{
        let selected = [...this.state.selected]
        let index = selected.findIndex(array => array == id)
        index == -1  ? selected.splice(selected.length, 0,id ) : selected.splice(index, 1 )
        this.props.navigation.setParams({selected:selected.length})
        this.setState({selected,allSelect:false})
      }}
      activeSelection = {this.props.activeSelection}
      selected = {this.state.selected.findIndex(array => array == item._id) > -1}
      onPressItem={this._onPressItem}
      {...item}
    />
  );
  renderActionSheetEditWine(){
    if (this.props.showPicker == true) {
      let keyOrder = this.props.search.keyOrder || 'region'
      let orderString = (this.props.search.order || 1) == 1 ? ' (décroissant)' : ' (croissant)'
      let order = this.props.search.order || 1
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
          this.props.navigation.navigate('choseCellar',{all:this.state.allSelect,selected:this.state.selected,cellarId:this.props.wines[0].cellarId})
          this.props.navigation.setParams({showPicker:false,activeSelection:false,selected:0})
        }
        },
      )
    }
  }
  renderActionSheetSortWine(){
    if (this.state.showSorting == true) {
      let keyOrder = this.props.search.keyOrder || 'region'
      let orderString = (this.props.search.order || 1) == 1 ? ' (décroissant)' : ' (croissant)'
      let order = this.props.search.order || 1
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
    }

  }

  getResults(){
    if (this.props.search) {
      this.props.fetchSearch(this.props.search).then(()=>{
        this.setState({refreshing:false})
      }).catch(e=>{
        console.log(e)
        this.setState({refreshing:false})
      })
    } else {
      this.props.fetchWines(this.props.search).then(()=>{
        this.setState({refreshing:false})
      }).catch(e=>{
        console.log(e)
        this.setState({refreshing:false})
      })
    }

  }
  render(){



    if (!this.props.wines) return (
      <View style={styles.root}>
        <ActivityIndicator />
      </View>)
    let wines = []
    Object.keys(this.props.wines).map((e,i)=>{
      let wine = this.props.wines[e]
      if (!wine) return null
      wines.push({
        id:i.toString(),
        _id: wine._id.toString(),
        key: wine._id.toString(),
        color:wine.color,
        stock:wine.stock || 0,
        price:wine.price,
        pastilles:wine.pastilles||[],
        appelation:wine.appelation,
        domain:wine.domain,
        annee:wine.annee,
        favorite:wine.favorite,
        region:wine.region,
        country:wine.country,
        cepage:wine.cepage || []
      })
    })
    this.renderActionSheetEditWine()
    this.renderActionSheetSortWine()




    return(
      <View style={styles.root}>
        <View style={styles.container}>
        {this.props.activeSelection ?
          <SelectBar
            allSelect = {this.state.allSelect}
            onPress={()=>{
              let selected = this.state.allSelect ? [] : this.props.wines.map(w => w._id);
              this.props.navigation.setParams({selected:selected.length})
              this.setState({selected,allSelect:!this.state.allSelect})
            }}
          />
          :
          <SearchBar
            searchIcon ={false}
            onChangeText={(search)=>this.setState({search})}
            placeholder='Recherche'
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
            // containerStyle={{flex:1,backgroundColor:'transparent',borderBottomWidth:0,borderTopWidth:0}}
           />
        }

        <FlatList
          refreshing={this.state.refreshing}
          onEndReached = {()=>{
            this.props.fetchWines('',{cellarId:this.props.cellarId,keyOrder:this.props.search.keyOrder || 'region',order:(this.props.search.order || 1), limit:this.state.limit+10}).then(()=>this.setState({limit:this.state.limit+10}))
          }}
          onRefresh={()=>{
            this.setState({refreshing:true}) // trigger reload of notif
            this.getResults()
          }}
          data={wines}
          keyExtractor={this._keyExtractor}
          onEndReachedThreshold={0.01}
          renderItem={this._renderItem}
          ListEmptyComponent={
            this.props.isSearching == true ?
            <View style={styles.emptyView}>
              <Text style={styles.title}>
                Aucun Resultat
              </Text>
            </View>
            :
            <View style={styles.emptyView}>
              <Text style={styles.title}>
                {messages.emptyCave}
              </Text>
            </View>

          }
        />

        </View>
        <TouchableOpacity
          style={styles.buttonView}
          onPress={()=>{
            this.props.resetWine()
            this.props.navigation.navigate('ficheWine')
          }}
          >
            <Text style={styles.buttonText}>Ajouter un Vin</Text>
        </TouchableOpacity>
  </View>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Wines)
const styles = StyleSheet.create({
  root : {
    justifyContent:'center',flex:1
  },
  container: {
    flex:1,
    backgroundColor: "transparent",
    justifyContent: "center",
    justifyContent:"flex-start",
  },

  emptyView : {
    alignItems:'center',justifyContent:'center',flex:1,marginVertical:30,padding:10
  },
  buttonView : {
    marginVertical:10,width:"80%",alignSelf:'center',justifyContent:'center',height:50,borderRadius:25,backgroundColor:'#9F041B'
  },
  buttonText:{
    textAlign: "center",
    padding: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  title: {
    fontSize: 20,
    fontFamily:"ProximaNova-Regular",
    color:"#434343",
    alignSelf:'flex-start',
    textAlign: 'center',
    marginHorizontal: 5,
    marginVertical:20
  },
});

import React, {Component} from 'react';
import CellarItem from '../components/list/cellarItem'
import {Animated,Button,Dimensions,ActivityIndicator,InteractionManager,Easing,Platform,ActionSheetIOS,Alert,FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import {Chip} from 'react-native-paper';
// import RNPickerSelect from 'react-native-picker-select';
// import ManagePhoto from '../components/modals/managePhoto'
// import firebase from 'react-native-firebase';
import bottle from '../assets/bottle.png'
import messages from '../components/texts/'
import ButtonCustom  from '../components/markers/button'
import Checkbox from '../components/markers/checkbox';
// import { Searchbar } from 'react-native-paper';
// import {carafageArray,makeRegionArray,makeStockArray,makeYearArray} from '../components/array/pickers'
// import {caracteristiques,colors,cepageValues,dialog,json,regions} from '../components/array/description'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchCellars,deleteCellar} from '../functions/api'
import {setCellar,resetCellar,resetSearch} from '../redux/actions'

const { height, width } = Dimensions.get('window');

function mapStateToProps(state,props){
  return {
    cellars : state.cellars,
    activeSelection : props.navigation.getParam('activeSelection') == true,
    showPicker : props.navigation.getParam('showPicker') == true
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({deleteCellar,fetchCellars,setCellar,resetCellar,resetSearch},dispatch)
}

class Cellars extends React.Component {
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
  }
  constructor(props){
    super(props)
    this.state = {firstQuery:'',refreshing:true,selected:[]}
    this._onPressItem = this._onPressItem.bind(this)
  }
  _keyExtractor = (item, index) => item.key;

  _onPressItem = (id: string) => {
    this.props.setCellar(this.props.cellars[id])
    this.props.navigation.navigate('wines',{cellarName:this.props.cellars[id].name})
  };

  componentDidMount(){
    this.props.fetchCellars().then(()=>this.setState({refreshing:false}))
    this.props.navigation.addListener('didFocus',
      payload => {
        console.debug('didFocus', payload);
        this.props.resetSearch()
      }
    );

  }
  _renderItem = ({item}) => (
    <CellarItem
      onPressItem={this._onPressItem}
      {...item}
      toggleSelect = {(id)=>{
        let selected = [...this.state.selected]
        let index = selected.findIndex(array => array == id)
        index == -1  ? selected.splice(selected.length, 0,id ) : selected.splice(index, 1 )
        this.props.navigation.setParams({selected:selected.length})
        this.setState({selected})
      }}
      activeSelection = {this.props.activeSelection}
      selected = {this.state.selected.findIndex(array => array == item._id) > -1}
    />
  );

  render(){
    const { firstQuery } = this.state;
    if (!this.props.cellars) return (
      <View style={styles.root}>
        <ActivityIndicator />
      </View>
    )
    let cellars = []
    Object.keys(this.props.cellars).map((e,i)=>{
      let celar = this.props.cellars[e]
      if (!celar) return null
      cellars.push({
        id:i.toString(),
        _id: celar._id,
        key: celar._id,
        stock:celar.stock,
        name:celar.name,
        description:celar.description
      })
    })

    return(
      <View style={styles.root}>
        <View style={styles.container}>
        {this.props.showPicker == true ?
          ActionSheetIOS.showActionSheetWithOptions(
          {
            options: this.state.selected.length > 1 ? ['Annuler', 'Supprimer' , 'Fusionner les caves'] : ['Annuler','Supprimer'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            this.props.navigation.setParams({showPicker:false})
            if (buttonIndex === 1) {
              this.props.deleteCellar(this.state.selected)
              this.setState({selected:[]})
              this.props.navigation.setParams({showPicker:false,activeSelection:false,selected:0})

              /* destructive action */
            } else if (buttonIndex === 2) {

            }
          },
        )

        : void 0}
        <FlatList
          refreshing={this.state.refreshing}

          data={cellars}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={
            this.props.isSearching == true ? void 0 :
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
            this.props.resetCellar()
            this.props.navigation.push('editCellar')
          }}
          >
            <Text
                style={styles.buttonText}>Ajouter une nouvelle Cave !</Text>
          </TouchableOpacity>
  </View>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Cellars)
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

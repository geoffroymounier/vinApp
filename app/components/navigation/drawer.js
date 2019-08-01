import React, { Component } from 'react';
import {NavigationActions,SafeAreaView} from 'react-navigation';
import { Text, View,Image, StyleSheet,TouchableOpacity,ImageBackground} from 'react-native'
import {bindActionCreators} from 'redux';
import {resetWine,setSearch,resetResults} from '../../redux/actions'
import {fetchSearch,logOutUser} from '../../functions/api'
import NavigationService from '../../functions/navigationService'
import Checkbox from '../markers/checkbox.js';
import {connect} from 'react-redux'
import moment from 'moment'

const year = moment().year()
function findRoute(routes,index){
  if (routes[index].routes ){
      return findRoute(routes[index].routes,routes[index].index)
  }

    return routes[index]
}

class EditWineOption extends Component {
  render(){
    let {activeItemKey} = this.props.activeItemKey
    return(
      <View style={styles.screenContainer}>
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={()=>void 0}>Supprimer ce Vin</Text>
          </View>
      </View>
    )
  }
}
class FicheWineOption extends Component {
  render(){
    let {activeItemKey} = this.props.activeItemKey
    return(
      <View style={styles.screenContainer}>
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('choseCellar')}>Déplacer de cave</Text>
          </View>
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={()=>void 0}>Supprimer ce Vin</Text>
          </View>
      </View>
    )
  }
}
class WinesOption extends Component {
  render(){
    let {activeItemKey} = this.props.activeItemKey
    return(
      <View style={styles.screenContainer}>
          <View style={{...styles.screenStyle,paddingHorizontal:10,justifyContent:'flex-start'}}>
            <Image style={{height:20,width:20}} source={require('../../assets/add.png')} />
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('editWine')}>Ajouter un Vin</Text>
          </View>
          <View style={{...styles.screenStyle,paddingHorizontal:10,justifyContent:'flex-start'}}>
              <Image style={{height:20,width:20}} source={require('../../assets/search.png')} />
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('filter')}>Recherche Détaillée</Text>
          </View>
          <View style={{...styles.screenStyle,paddingHorizontal:10,justifyContent:'flex-start'}}>
              <Image style={{height:20,width:20}} source={require('../../assets/edit.png')} />
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('editCellar')}>Modifier cette Cave</Text>
          </View>
          <View style={{...styles.screenStyle,paddingHorizontal:10,justifyContent:'flex-start'}}>
              <Image style={{height:20,width:20}} source={require('../../assets/more.png')} />
              <Text style={[styles.screenTextStyle]} onPress={this.props.setParams({activeSelection:true})}>Selectionner des vins</Text>
          </View>
      </View>
    )
  }
}
class CellarsOption extends Component {
  render(){
    let {activeItemKey} = this.props.activeItemKey
    return(
      <View style={styles.screenContainer}>
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('filter')}>Chercher un vin</Text>
          </View>

          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={this.props.setParams({activeSelection:true})}>Selectionner des caves</Text>
          </View>
      </View>
    )
  }
}
let attribute = {
  editWine : EditWineOption,
  ficheWine : FicheWineOption,
  wines:WinesOption,
  cellars:CellarsOption
}
function mapStateToProps(state){
  return {
    user: state.user,
    search : state.search || {}
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({resetWine,fetchSearch,setSearch,resetResults,logOutUser}, dispatch)
}
class DrawerContentComponents extends Component {
  constructor(props){
    super(props)
    this.state = {}

  }
    navigateToScreen = ( route,params = {}) =>(
        () => {

        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params
        });
        // this.props.resetWine()
        this.props.navigation.dispatch(navigateAction);
    })
    setParams = ( params,key ) =>(
        () => {
        let setParamsAction = NavigationActions.setParams({params,key})
        this.props.navigation.dispatch(setParamsAction);
        this.props.navigation.toggleDrawer()
    })
  static getDerivedStateFromProps(props, prevState){
    let {routes,index} = props.navigation.state
    let routeName = findRoute(routes,index)
    return {...routeName}
    }
  triggerSearch(){
    this.props.resetResults()
    setTimeout(()=>this.props.fetchSearch(this.props.search),500)
    if (this.state.routeName == 'cellars') {
      const navigateAction = NavigationActions.navigate({
          routeName: 'results'
      });
      this.props.navigation.dispatch(navigateAction);
    }
  }
  render() {
    let {routeName,params,key} = this.state
    let Attribute = attribute[routeName]
    // console.log(this.props.items.find(it => it.key == this.props.activeItemKey ))
    return (
        <SafeAreaView style={styles.container}>
          <View style={{flex:1}}>
            <View style={{...styles.screenStyle,...styles.screenContainer}}>
                {/* <ImageBackground source={require('../../assets/eye.png')} style={{flex: 1, width: 280, justifyContent: 'center'}} > */}
                    {/* <Text style={styles.screenTextStyle}>{this.props.user.email}</Text> */}
                    {/* <Text style={styles.headerText}>You can display here logo or profile image</Text> */}
                {/* </ImageBackground> */}

            {attribute[routeName] ?
            <Attribute activeItemKey={this.props.activeItemKey}
              setParams={(params)=>this.setParams(params,key)}
              navigateToScreen={(s)=>this.navigateToScreen(s)} />
            : void 0 }
            </View>
            {(/cellars|wines/).test(this.state.routeName) ?
            <View style={{paddingTop:40}}>
                <TouchableOpacity onPress={()=>{
                  this.props.search.minApogee != year ? this.props.setSearch({minApogee:year,maxApogee:year})
                  : this.props.setSearch({minApogee:null,maxApogee:null})
                  this.triggerSearch()
                }}
                  style={[styles.screenStyle]}>
                  <Text style={[styles.screenTextStyle]}>{"Apogée " + year}</Text>
                  <Checkbox
                   onPress={()=>{
                     this.props.search.minApogee != year ? this.props.setSearch({minApogee:year,maxApogee:year})
                     : this.props.setSearch({minApogee:null,maxApogee:null})
                     this.triggerSearch()
                   }}
                   checked={this.props.search.minApogee == year && this.props.search.maxApogee == year}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=>{
                    this.props.search.favorite == true ? this.props.setSearch({favorite:null})
                    : this.props.setSearch({favorite:true})
                     this.triggerSearch()
                  }}
                  style={[styles.screenStyle]}>
                  <Text style={[styles.screenTextStyle]}>Favoris</Text>
                  <Checkbox
                    onPress={()=>{
                      this.props.search.favorite == true ? this.props.setSearch({favorite:null})
                      : this.props.setSearch({favorite:true})
                       this.triggerSearch()
                    }}
                   checked={this.props.search.favorite}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=>{
                    this.props.search.stock == true ? this.props.setSearch({stock:null})
                    : this.props.setSearch({stock:true})
                     this.triggerSearch()
                  }}
                  style={[styles.screenStyle]}>
                  <Text style={[styles.screenTextStyle]}>En Stock</Text>
                  <Checkbox
                    onPress={()=>{
                      this.props.search.stock == true ? this.props.setSearch({stock:null})
                      : this.props.setSearch({stock:true})
                       this.triggerSearch()
                    }}
                   checked={this.props.search.stock}
                  />
                </TouchableOpacity>
            </View>
            : void 0}
          </View>
          <View style={styles.screenContainer}>
              <View style={[styles.screenStyle]}>
                  <Text style={[styles.screenTextStyle]}>Paramètres</Text>
              </View>
              <TouchableOpacity style={[styles.screenStyle]} onPress={()=>{
                    this.props.logOutUser()
                    this.props.navigation.navigate('AuthLoading')


                }}>
                  <Text style={[styles.screenTextStyle]}>Deconnexion</Text>
              </TouchableOpacity>
          </View>
        </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex:1
    },
    headerContainer: {
        height: 150,
    },
    headerText: {
        color: '#fff8f8',
    },
    screenContainer: {
        paddingTop: 20,

        width: '100%',
    },
    screenStyle: {
        // height: 30,
        marginTop: 2,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        // width: '100%'
    },
    screenTextStyle:{
        fontSize: 20,
        marginLeft: 20,

        textAlign: 'center'
    },
    selectedTextStyle: {
        fontWeight: 'bold',
        color: '#00adff'
    },
    activeBackgroundColor: {
        backgroundColor: 'grey'
    }
});
export default connect(mapStateToProps,matchDispatchToProps)(DrawerContentComponents)

import React, { Component } from 'react';
import {NavigationActions,SafeAreaView} from 'react-navigation';
import { Text, View, StyleSheet,ImageBackground} from 'react-native'
import {bindActionCreators} from 'redux';
import {resetWine} from '../../redux/actions'
import {connect} from 'react-redux'
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
              <Text style={[styles.screenTextStyle]} onPress={()=>void 0}>Déplacer de cave</Text>
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
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('editWine')}>Ajouter un Vin</Text>
          </View>
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('filter')}>Recherche Détaillée</Text>
          </View>
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={this.props.navigateToScreen('editCellar')}>Modifier cette Cave</Text>
          </View>
          <View style={[styles.screenStyle]}>
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
              <Text style={[styles.screenTextStyle]} onPress={()=>this.props.navigateToScreen('filter')}>Chercher un vin</Text>
          </View>
          <View style={[styles.screenStyle]}>
              <Text style={[styles.screenTextStyle]} onPress={()=>this.props.navigateToScreen('editCellar')}>Ajouter une cave</Text>
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
    user: state.user
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({resetWine}, dispatch)
}
class DrawerContentComponents extends Component {
  constructor(props){
    super(props)
    this.state = {}

  }
    navigateToScreen = ( route ) =>(
        () => {

        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.resetWine()
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
          </View>
          <View style={styles.screenContainer}>
              <View style={[styles.screenStyle]}>
                  <Text style={[styles.screenTextStyle]}>Paramètres</Text>
              </View>
              <View style={[styles.screenStyle]}>
                  <Text style={[styles.screenTextStyle]}>Deconnexion</Text>
              </View>
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
        height: 30,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
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

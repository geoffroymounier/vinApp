import React from 'react'
// import styles from '../styles'
import {View,ScrollView,TouchableOpacity, Text,Button,Image,Modal } from 'react-native'
import {DrawerItems, SafeAreaView, createStackNavigator, createDrawerNavigator , createAppContainer , createSwitchNavigator, createBottomTabNavigator} from 'react-navigation'
import Login from '../views/login'
import AuthLoading from '../views/authLoading'
import DrawerContentComponents from '../components/navigation/drawer'
// import Filter from '../views/filter'
import Cellars from '../views/cellars'
import Results from '../views/results'
import Wines from '../views/wines'
import EditWine from '../views/editWine'
import FicheWine from '../views/ficheWine'
import EditCellar from '../views/editCellar'
import Region from '../components/options/region'
import Country from '../components/options/country'
import Appelation from '../components/options/appelation'
import Cepage from '../components/options/cepage'
import Annee from '../components/options/annee'
import Accords from '../components/options/accords'
import Aromes from '../components/options/aromes'
import Pastilles from '../components/options/pastilles'
import ChoseCellar from '../components/options/choseCellar'
import Filter from '../views/filter'
// import Profile from '../views/profile'

const defaultNavigationOptions = ({ navigation  }) => {

  return {
  headerRight: (
    <TouchableOpacity onPress={() => navigation.openDrawer()} >
      <Image style={{resizeMode: 'contain',height:20}} source={require('../assets/menu.png')} />
    </TouchableOpacity>
    )
  }
};
const filterStack = createStackNavigator({
  filter:  Filter,
  editWine: EditWine,
  editCellar: EditCellar,
  region:Region,
  country:Country,
  appelation:Appelation,
  cepage: Cepage,
  annee : Annee,
  accords : Accords,
  aromes : Aromes,
  pastilles:Pastilles,
  choseCellar:ChoseCellar
},{
  defaultNavigationOptions,

})

const TabStackWine = createDrawerNavigator({
  _main : createStackNavigator({
    _cellar : createStackNavigator({
      cellars:  Cellars,
      editCellar: EditCellar,
      wines : Wines,
      editWine: EditWine,
      ficheWine: EditWine,
      filter : Filter,
      results : Results,
      login : Login
    },{

      defaultNavigationOptions,

    }),
    region : Region,
    country:Country,
    appelation:Appelation,
    cepage: Cepage,
    annee : Annee,
    accords : Accords,
    aromes : Aromes,
    pastilles:Pastilles,
    choseCellar:ChoseCellar
  },{
    mode : 'modal',
    headerMode:'none',
    defaultNavigationOptions
  }),
  filter : filterStack,
  login : filterStack


},{
  contentComponent:DrawerContentComponents,
  drawerPosition:'right',
  drawerType:'slide'
});
const LoginStack = createStackNavigator({
      login:  Login
});
const AuthLoadingStack = createStackNavigator({
      home:  AuthLoading
});


export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingStack,
    Login: LoginStack,
    TabStackWine: TabStackWine,

  },
  {
    initialRouteName: 'AuthLoading',
  }
));

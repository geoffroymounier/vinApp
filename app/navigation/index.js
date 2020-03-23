import React from 'react'
// import styles from '../styles'
import {View,ScrollView,TouchableOpacity, Text,Button,Image,Modal } from 'react-native'
import {DrawerItems, SafeAreaView, createStackNavigator, createDrawerNavigator , createAppContainer , createSwitchNavigator, createBottomTabNavigator} from '@react-navigation/native'
import Login from '../views/login'
import SignIn from '../views/signin'
import SignUp from '../views/signup'
import ResetPass from '../views/resetPass'
import AuthLoading from '../views/authLoading'
import LinearGradient from 'react-native-linear-gradient';
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
    headerRight:(
      <TouchableOpacity onPress={() => navigation.openDrawer()} >
        <Image style={{resizeMode: 'contain',height:20,tintColor:'white'}} source={require('../assets/menu.png')} />
      </TouchableOpacity>
    ),
    headerBackTitle:null,
    headerBackground: (
      <LinearGradient
        start={{x: 0, y: 0}}
        style={{flex:1}}
        end={{x: 1, y: 0}} colors={[ '#9F041B','#E02535']}
      />
    ),
    headerStyle:{height:60},
    headerTintColor:'white'
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
      // editCellar: EditCellar,
      wines : Wines,
      editWine: EditWine,
      ficheWine: EditWine,
      filter : Filter,
      results : Results,
      login : Login
    },{
      defaultNavigationOptions,
    }),
    editCellar: EditCellar,
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
    headerMode: 'none',
    mode: 'modal',
    transparentCard: true,
    navigationOptions: {
      header : null,
      gesturesEnabled: false
    },
    cardStyle: {
      // makes transparentCard work for android
      opacity: 1.0,
      backgroundColor:'rgba(200,200,200,0.4)'
    },
    // defaultNavigationOptions
  }),
  filter : filterStack,
  login : filterStack


},{
  contentComponent:DrawerContentComponents,
  drawerPosition:'right',
  drawerType:'front'
});
const LoginStack = createStackNavigator({
      login:  Login,
      signIn : SignIn,
      signUp : SignUp,
      resetPass: ResetPass
},{
  defaultNavigationOptions: {
    headerBackground: (
      <LinearGradient
        start={{x: 0, y: 0}}
        style={{flex:1}}
        end={{x: 1, y: 0}} colors={[ '#9F041B','#E02535']}
      />
    ),
        headerBackTitle:null,
        headerTintColor: '#fff',
  },
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

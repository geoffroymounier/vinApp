import React from 'react'
// import styles from '../styles'
import {View,ScrollView,TouchableOpacity, Text,Button,Image,Modal } from 'react-native'
import {DrawerItems, SafeAreaView, createStackNavigator, createDrawerNavigator , createAppContainer , createSwitchNavigator, createBottomTabNavigator} from 'react-navigation'
import Login from '../views/login'
import AuthLoading from '../views/authLoading'
// import Filter from '../views/filter'
import Cellars from '../views/cellars'
import Wines from '../views/wines'
import EditWine from '../views/editWine'
import EditCellar from '../views/editCellar'
import Region from '../components/options/region'
import Country from '../components/options/country'
import Appelation from '../components/options/appelation'
import Cepage from '../components/options/cepage'
import Annee from '../components/options/annee'
import Accords from '../components/options/accords'
import Aromes from '../components/options/aromes'
// import Profile from '../views/profile'



const TabStackWine = createStackNavigator({
      cellars:  Cellars,
      wines : Wines,
      editWine: EditWine,
      editCellar: EditCellar,
      region:Region,
      country:Country,
      appelation:Appelation,
      cepage: Cepage,
      annee : Annee,
      accords : Accords,
      aromes : Aromes
      // filter: Filter,
      // profile: Profile
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

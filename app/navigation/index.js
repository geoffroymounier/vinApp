import React from 'react'
// import styles from '../styles'
import {View,ScrollView,TouchableOpacity, Text,Button,Image,Modal } from 'react-native'
import {DrawerItems, SafeAreaView, createStackNavigator, createDrawerNavigator , createAppContainer , createSwitchNavigator, createBottomTabNavigator} from 'react-navigation'
import Login from '../views/login'
import AuthLoading from '../views/authLoading'
// import Filter from '../views/filter'
// import Collection from '../views/collection'
// import EditFile from '../views/editFile'
// import Profile from '../views/profile'



// const TabStackWine = createStackNavigator({
//       collection:  Collection,
//       editFile: EditFile,
//       filter: Filter,
//       profile: Profile
// });
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
    // TabStackWine: TabStackWine,

  },
  {
    initialRouteName: 'AuthLoading',
  }
));

import { NavigationActions,StackActions } from '@react-navigation/native';

let _navigator;
var activeStack = "_cellar";
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}
function reset(routeName,params) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName : activeStack,
          params,
        }),
      ],
    }),
  );
  setActiveTab(routeName)
}
function setActiveTab(routeName){
  activeStack = routeName
}
// add other navigation functions that you need and export them

export default {
  navigate,
  reset,
  setActiveTab,
  setTopLevelNavigator,
};

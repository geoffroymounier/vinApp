import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Provider } from 'react-redux'
import createStore from './app/redux/store/configureStore.js'
import ReduxNavigation from './app/navigation/'
import NavigationService from './app/functions/navigationService'

// create our store
const store = createStore()


export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Creating the socket-client instance will automatically connect to the server.


  }
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <ReduxNavigation ref={navigatorRef => {NavigationService.setTopLevelNavigator(navigatorRef)}} />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

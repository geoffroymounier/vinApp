import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Provider } from 'react-redux'
import {store,persistor} from './app/redux/store/configureStore.js'
import ReduxNavigation from './app/navigation/'
import NavigationService from './app/functions/navigationService'
import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';

// import { withAuthenticator } from 'aws-amplify-react-native';

Amplify.configure(awsconfig);

class App extends React.Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
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
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

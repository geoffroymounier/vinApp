import { StyleSheet,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  //main containers
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
    borderRadius: 12,
    overflow:"hidden",
    textAlign:"center",
    fontSize:24
  }
})
export default styles

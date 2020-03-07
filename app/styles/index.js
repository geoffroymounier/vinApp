import { StyleSheet,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  //main containers
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  }
});
export default styles

import { StyleSheet,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  //main containers
  icon: {
    resizeMode: 'contain',
    height:"100%"
  }
})
export default styles

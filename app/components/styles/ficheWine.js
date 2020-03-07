import { StyleSheet,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  //main containers
  cartoucheRow : {
    flexDirection:'row',justifyContent:'space-between',alignItems:'center'
  },
  cartoucheLeft: {
    flex:2,justifyContent:'space-between',borderWidth:0.5,borderColor:'blue'
  },
  cartoucheRight: {
    flex:2,justifyContent:'space-between',borderWidth:0.5,borderColor:'blue'
  }
})
export default styles

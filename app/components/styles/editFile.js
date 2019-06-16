import { StyleSheet,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  //main containers
  cartoucheRow : {
    flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:5
  },
  cartoucheLeft: {
    flexDirection:'row',flex:2,justifyContent:'flex-start'
  },
  cartoucheRight: {
    flexDirection:'row',flex:4,justifyContent:'flex-start'
  }
})
export default styles

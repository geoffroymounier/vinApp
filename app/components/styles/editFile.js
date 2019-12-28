import { StyleSheet,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  //main containers
  cartoucheRow : {
    flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:5
  },
  cartoucheLeft: {
    flexDirection:'row',flex:1,justifyContent:'flex-start',alignItems:'flex-start',
    paddingVertical:15,borderBottomWidth:1,borderColor:"#F5F5F5"
  },
  cartoucheRight: {
    flexDirection:'row',flex:1,justifyContent:'flex-end',alignItems:'flex-start',
    paddingVertical:10,borderBottomWidth:1,borderColor:"#F5F5F5"
  }
})
export default styles

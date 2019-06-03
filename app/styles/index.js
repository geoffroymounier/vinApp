import { StyleSheet,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  //main containers
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F5FCEE',
  },
  container2:{
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F5FCE2',
  },
  horizontalContainer:{
    display:"flex",
    flexDirection: "row",
  },
  qrCodeContainer:{
    backgroundColor:"orange",
    justifyContent: 'center',
    alignItems: 'center',
    height:width-20,
    width:width-20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modal:{
    backgroundColor:'lightblue',
    padding:20,
    borderRadius:12,
    borderWidth:StyleSheet.hairlineWidth,
  },
  //basic components
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
    borderRadius: 12,
    overflow:"hidden",
    textAlign:"center",
    fontSize:24
  },
  p:{
    textAlign:"center",
    fontSize:16,
  },
  h1:{
    fontSize:36
  },
  h2:{
    fontSize:24,
    color:"blue"
  },
  h3:{
    fontSize:20,
    color:"green"
  },

  //tabs
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48
  },
  //fields
  field: {
    marginVertical: 5,
    justifyContent: "center"
  },
  label: {
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    height: 40,
    paddingLeft: 6,
    borderBottomColor:'#000000',
    borderBottomWidth:1
  }
});
export default styles

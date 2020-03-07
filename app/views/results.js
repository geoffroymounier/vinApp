import React, {Component} from 'react';
import {Animated,Dimensions,ActivityIndicator,InteractionManager,Easing,Platform,ActionSheetIOS,Alert,FlatList,TouchableHighlight,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity} from 'react-native';
import WineItem from '../components/list/wineItem'
import Button from '../components/markers/button'
import messages from '../components/texts/'
const heartFull = require('../assets/heart-full.png')
import {caracteristiques,colors,cepageValues,dialog,json,regions} from '../components/array/description'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchSearch} from '../functions/api'
import {setWine,resetWine,resetResults} from '../redux/actions'

const { height, width } = Dimensions.get('window');

function mapStateToProps(state,props){
  console.log(state.results)
  return {
    wines : (state.results),
    search : state.search
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setWine,resetWine,resetResults,fetchSearch},dispatch)
}

class Wines extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    return {
    headerRight: null,
    headerTitle:'Vins trouvés'
    }
  }
  constructor(props){
    super(props)
    this.state = {refreshing:false}
    this._onPressItem = this._onPressItem.bind(this)
  }
  _keyExtractor = (item, index) => item.key;

  _onPressItem = (id: string) => {
    this.props.resetWine()
    this.props.setWine(this.props.wines[id])
    this.props.navigation.navigate('ficheWine')
  };

  _renderItem = ({item}) => (
    <WineItem
      onPressItem={this._onPressItem}
      manageItem={this.manageItem}
      {...item}
    />
  );
  getResults(){

    this.props.fetchSearch(this.props.search).then(()=>{
      this.setState({refreshing:false})
    }).catch(e=>{
      console.log(e)
      this.setState({refreshing:false})
    })
  }
  componentDidMount(){
    this.getResults()
  }
  render(){

    if (!this.props.wines) return (
      <View style={styles.root}>

        <ActivityIndicator />
      </View>)
    let wines = []
    Object.keys(this.props.wines).map((e,i)=>{
      let wine = this.props.wines[e]
      if (!wine) return null
      wines.push({
        id:i.toString(),
        key: wine._id,
        color:wine.color,
        stock:wine.stock,
        price:wine.price,
        appelation:wine.appelation,
        domain:wine.domain,
        annee:wine.annee,
        favorite:wine.favorite,
        region:wine.region,
        cepage:wine.cepage || []
      })
    })

    return(
      <View style={styles.root}>
        <View style={styles.container}>
        <FlatList
          onRefresh={()=>{
            this.setState({refreshing:true}) // trigger reload of notif
            this.getResults()
          }}
          refreshing={this.state.refreshing}
          data={wines}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Text style={styles.title}>
                Aucun Resultat
              </Text>
            </View>

          }
        />

        </View>

  </View>
    )
  }
}
export default connect(mapStateToProps,matchDispatchToProps)(Wines)
const styles = StyleSheet.create({
  root : {
    justifyContent:'center',flex:1
  },
  container: {
    flex:1,
    backgroundColor: "transparent",
    justifyContent: "center",
    justifyContent:"flex-start",
  },

  emptyView : {
    alignItems:'center',justifyContent:'center',flex:1,marginVertical:30,padding:10
  },
  buttonView : {
    marginVertical:10,width:"80%",alignSelf:'center',justifyContent:'center',height:50,borderRadius:25,backgroundColor:'#9F041B'
  },
  buttonText:{
    textAlign: "center",
    padding: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  title: {
    fontSize: 20,
    fontFamily:"ProximaNova-Regular",
    color:"#434343",
    alignSelf:'flex-start',
    textAlign: 'center',
    marginHorizontal: 5,
    marginVertical:20
  },
});

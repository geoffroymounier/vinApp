import React, {Component} from 'react';
import {Platform, StyleSheet, Button,Text,Dimensions, View,Image,ScrollView,KeyboardAvoidingView,TextInput,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import {SafeAreaView} from 'react-navigation'
import {bindActionCreators} from 'redux';
import {colors as _colors,cepageValues,accordsValues,json} from '../components/array/description'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import CustomMarker from '../components/markers/customMarker'
import {setSearch,resetResults,resetSearch} from '../redux/actions'
import {fetchSearch} from '../functions/api'

const { height, width } = Dimensions.get('window');

function mapStateToProps(state){
  return {
    wine : state.search || {},
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({resetSearch,setSearch,resetResults,fetchSearch},dispatch)
}

const deleteIcon = <Image source={require('../assets/times.png')} color='#515151' style={{height:10,resizeMode:'contain'}}/>

class Filter extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    return {
    headerRight: null
    }
  }
  constructor(props){
    super(props);
    this.state = {
      apogeeActive:false,
      yearActive:false,
      priceActive:false
    }
  }
  triggerSearch(){
    this.props.resetResults()
    this.props.fetchSearch(this.props.wine)
    this.props.navigation.push('results')
  }
  componentDidMount(){
    this.props.navigation.addListener('willBlur',
    payload => {
      this.props.resetResults()
      if (!payload.action.routeName)this.props.resetSearch() // only if we go back
    })
  }
  render() {

    let {minYear = 2010,minPrice=0,maxPrice=10, maxYear=2019,minApogee=2018,maxApogee=2020,cuisine_monde,price,favorite,stock,nez,legumes,viandes,poissons,desserts,aperitif,fromages,bouche,appelation,domain,annee,before,apogee,carafage,region,country,pastilles} = this.props.wine
    let {apogeeActive,yearActive,priceActive} = this.state
    let cepage = this.props.wine.cepage || []
    let color = this.props.wine.color || {}

    return (

      <KeyboardAvoidingView behavior='padding' >
      <ScrollView style={{padding:0,paddingTop:0,backgroundColor:"#FEFDF8"}}>
        <SafeAreaView style={{...styles.container,flexDirection:'row',alignItems:'flex-start',marginBottom:130}}>
          <View style={{...styles.container}}>
          <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',height:50,paddingHorizontal:0}}>
              {Object.keys(_colors).map((element,i) => {
              let colorJson = _colors[element] || {}
              let color = colorJson.color
              let colorArray = [...this.props.wine.color||[]]
              return (
                <TouchableOpacity key={element}
                  onPress = {()=> {
                    let index = colorArray.findIndex(c => c == element)
                    index == -1  ? colorArray.splice(colorArray.length, 0, element ) : colorArray.splice(index, 1 )
                    this.props.setSearch({color:colorArray})
                  }}
                  style={{flexDirection:'row',justifyContent:'space-around',width:30,height:30,alignItems:'center',paddingHorizontal:10,borderRadius:15,backgroundColor: colorArray.findIndex(c => c == element) > -1 ? 'gray' : '#FEFDF8'}}
                  >
                  <View style={{backgroundColor:(color : 'black'),borderWidth:1,borderColor:'#bababa',borderRadius:12,width:24,height:24,marginHorizontal:10}}></View>
                </TouchableOpacity>
              )
              })}
            </View>

          <TouchableOpacity onPress={()=>this.refs.domaine.focus()} style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{...styles.title,color:domain == '' ? 'lightgray' : void 0}}>Domaine : </Text>
              <TextInput ref={'domaine'} value={domain} placeholder={'Non Précisé'} style={{fontSize:16}} onChangeText={(domain) => this.props.setSearch({domain})}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.push('country',{search:true})} style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>

                <Text style={{...styles.title,color:country == '' ? 'lightgray' : void 0}}>Pays : </Text>
              </View>
              <Text style={styles.title}>{country || "" }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.props.navigation.push('region',{search:true})} style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>

                <Text style={{...styles.title,color:region == '' ? 'lightgray' : void 0}}>Region :</Text>
              </View>
              <Text
                style={styles.title}
                >{region || "" }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.props.navigation.push('appelation',{search:true})} style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>

                <Text style={{...styles.title,color:appelation == '' ? 'lightgray' : void 0}}>Indication Géographique :</Text>
              </View>
              <Text
                style={styles.title}
                >{appelation || "" }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress = {()=>this.setState({priceActive:!priceActive})}
            style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{...styles.title,color:!priceActive ? 'lightgray' : void 0}}>Prix: </Text>
                <MultiSlider
                  min={0}
                  values={[minPrice,maxPrice]}
                  sliderLength={250}
                  enabledOne={priceActive}
                  enabledTwo={priceActive}
                  isMarkersSeparated={true}
                  customMarkerLeft={(e) => <CustomMarker
                     active = {priceActive}
                     suffix={'€'}
                   currentValue={e.currentValue}/>
                   }
                   customMarkerRight={(e) => <CustomMarker
                      active = {priceActive}
                      suffix={'€'}
                      currentValue={e.currentValue}/>
                  }
                  max={100}
                  onValuesChangeFinish={(e)=>this.props.setSearch({minPrice:e[0],maxPrice:e[1]})}
                />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress = {()=>this.setState({yearActive:!yearActive})}
            style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{...styles.title,color:!yearActive ? 'lightgray' : void 0}}>Année : </Text>
                <MultiSlider
                  min={1950}
                  values={[minYear,maxYear]}
                  sliderLength={250}
                  enabledOne={yearActive}
                  enabledTwo={yearActive}
                  allowOverlap
                  isMarkersSeparated={true}
                  customMarkerLeft={(e) => <CustomMarker
                     active = {yearActive}
                   currentValue={e.currentValue}/>
                   }
                 customMarkerRight={(e) => <CustomMarker
                  active = {yearActive}
                  currentValue={e.currentValue}/>
                  }
                  max={2040}
                  allowOverlap
                  onValuesChangeFinish={(e)=>this.props.setSearch({minYear:e[0],maxYear:e[1]})}
                />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress = {()=>this.setState({apogeeActive:!apogeeActive})}
            style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{...styles.title,color:!apogeeActive ? 'lightgray' : void 0}}>Apogée : </Text>
                <MultiSlider
                  min={2018}
                  values={[minApogee,maxApogee]}
                  sliderLength={250}
                  enabledOne={apogeeActive}
                  enabledTwo={apogeeActive}
                  isMarkersSeparated={true}
                  customMarkerLeft={(e) => <CustomMarker
                  active = {apogeeActive}
                   currentValue={e.currentValue}/>
                   }
                 customMarkerRight={(e) => <CustomMarker
                  active = {apogeeActive}
                  currentValue={e.currentValue}/>
                  }
                  max={2025}
                  allowOverlap
                  onValuesChangeFinish={(e)=>this.props.setSearch({minApogee:e[0],maxApogee:e[1]})}
                />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.push('cepage',{search:true})}
            style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{...styles.undertitle,alignSelf:'flex-start'}}>{cepageValues.placeholder}</Text>
              <View style={{flex:1,flexWrap:'wrap',flexDirection:'row',}}>
              {cepage.map((e,i) => (
                <View key={i} style={{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'gray',borderRadius:15,padding:5,margin:3}} >
                    <Text style={{color:'#515151',fontSize:15,fontWeight:'600'}}>{e}</Text>
                </View>
              )
              )}
              </View>

            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={()=>this.setState({modalPastille:'modalPastille'})}
            style={styles.TouchableOpacity}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center',alignSelf:'baseline',flexWrap: "wrap",paddingVertical:5}}>
              <Text style={{...styles.title,color:pastilles.length == 0 ? 'lightgray' : void 0}}>Moments</Text>

              {pastilles.map((e,i) => {
              return (
                <View key={i} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#bababa',borderRadius:15,marginHorizontal:5}} >
                  <Icon name="times" size={20} color='black'
                    onPress={() => {
                    let newArray = pastilles
                    newArray.splice(i,1)
                    this.setState({pastilles:newArray})
                  }}
                   style={{alignSelf:'center',paddingLeft:7}}/>
                  <Chip style={{backgroundColor:'transparent'}}>{pastillesValues.values[e]}</Chip>
                </View>
              )
              })}
            </View>
          </TouchableOpacity> */}


          <View style={{...styles.container,flexDirection:'row',width:'100%',alignItems:'flex-start',backgroundColor:"#bababa",borderBottomWidth:1,borderBottomColor:"#333333",borderTopWidth:1,borderTopColor:"#333333"}}>
            <Text style={{...styles.title,fontWeight:'800'}}>{'ACCORDS'}</Text>
          </View>
          {Object.keys(accordsValues).map((accords,index) => {
            let accord = accordsValues[accords]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.push('accords',{keyValue:accords,search:true})}
                key={index} style={{width:"100%",flexDirection:'row',alignSelf:'baseline',flexWrap: "wrap",alignItems:'center',paddingVertical:10}}>
                <Image  source={accord.icon} style={{marginHorizontal:10,width:28,height:28}}/>
              {(this.props.wine[accords]||[]).map((e,i) => {
                return (
                  <View key={i}
                    style={{flexDirection:'row',alignItems:'center',
                      paddingHorizontal:10,
                      margin:3,
                      shadowRadius: 3,
                      height:25,borderWidth:1,borderColor:accord.color,borderRadius:15,margin:5}} >
                      <Text style={{fontSize:14}}>{e}</Text>
                  </View>

                )
              })}
            </TouchableOpacity>
            )

          })}
          <View style={{...styles.container,flexDirection:'row',width:'100%',alignItems:'flex-start',backgroundColor:"#eee5da",
            }}>
            <Text style={{...styles.title,fontWeight:'800'}}>{'DÉGUSTATION'}</Text>
          </View>
          {Object.keys(json).map((caracts,index) => {
            let caract = json[caracts]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.push('aromes',{keyValue:caracts,search:true})}
                key={index} style={{width:"100%",flexDirection:'row',alignSelf:'baseline',flexWrap: "wrap",alignItems:'center',paddingVertical:10}}>


                <Image source={caract.icon} style={{marginHorizontal:10,width:25,height:25}}/>
              {(this.props.wine[caracts]||[]).map((e,i) => {
                return (
                  <View key={i}
                    style={{flexDirection:'row',alignItems:'center',
                      paddingHorizontal:10,
                      margin:3,
                      shadowRadius: 3,
                      height:25,borderWidth:1,borderRadius:15,margin:5}} >
                      <Text style={{fontSize:14}}>{e}</Text>
                  </View>

                )
              })}

            </TouchableOpacity>
            )

          })}



        </View>

      </SafeAreaView>

      </ScrollView>
      <View style={{position:'absolute',zIndex:3,bottom:0,left:0,alignItems:'center',width:'100%',height:55,flex:1,borderTopWidth:1,borderColor:'#bababa',backgroundColor:'#FEFDF8'}}>
        <TouchableOpacity onPress={() => this.triggerSearch()} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:55,marginBottom:5,width:1.1*width,backgroundColor:"#530000"}}>

            <Text style={{color:'#FEFDF8',fontWeight:'600',fontSize:16}}>CHERCHER</Text>

        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>




    );
  }
}
const pickerStyle = {
    viewContainer:{alignSelf:'center',paddingHorizontal:0}
  }
const styles = StyleSheet.create({
  TouchableOpacity : {flexDirection:'row',justifyContent:'space-between',alignItems:'center',minHeight:50,paddingHorizontal:10,borderBottomWidth:1,borderBottomColor:"#333333"},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  label:{
    alignSelf:'center',
    fontSize: 20,
    textAlign: 'left',
    marginRight:20,
  },

  textInputPicker:{
    color:'#262626',
    // padding:10,

    // paddingBottom:8,
    fontSize:16,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center'
  },
  textInput:{
    borderWidth:0,

    borderColor:'transparent'
  },
  chip:{
    margin:5,
  },
  title: {
    fontSize: 18,
    alignSelf:'flex-start',
    textAlign: 'left',
    margin: 10,
  },
  domain: {
    fontSize: 22,
    color:"#262626",
    alignSelf:'flex-start',
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
  },
  appelation: {
    color:"#262626",
    fontWeight:"800",
    fontSize: 24,
    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 10,
    marginVertical: 3,
  },
  undertitle: {
    fontSize: 16,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    textAlign: 'left',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default connect(mapStateToProps,matchDispatchToProps)(Filter)

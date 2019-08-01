import React, {Component} from 'react';
import {Button,Platform, Alert,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity} from 'react-native';
import Icon from '../components/markers/icon.js'
import ModalMultipleChoice from '../components/modals/modalMultipleChoice.js'
import ModalSearchChoice from '../components/modals/modalSearchChoice.js'
import ModalSingleChoice from '../components/modals/modalSingleChoice.js'
import ModalPhotoChoice from '../components/modals/modalPhotoChoice.js'
import RNPickerSelect from 'react-native-picker-select';
import ManagePhoto from '../components/modals/managePhoto'
import regionArray from '../components/array/area'
const arrowRight = require('../assets/arrow-right.png')
const heartEmpty = require('../assets/heart-empty.png')
const heartFull = require('../assets/heart-full.png')
const decanter = require('../assets/decanter.png')
const grapes = require('../assets/grapes.png')
const thermometer = require('../assets/thermometer.png')
const star = require('../assets/star.png')
const history = require('../assets/history.png')
const bubbles = require('../assets/bubbles.png')
import countries from '../assets/countries/index.js'
import raw from '../components/array/raw'
import {images,editFile} from 'styles'
import {country_code,getCountryCode} from '../components/array/country_code'
import alasql from 'alasql'
import {carafageArray,temperatureArray,makeTypologieArray,makePriceArray,makeRegionArray,makeStockArray,terrainArray,makeYearArray,lastYearArray,apogeeArray} from '../components/array/pickers'
import {caracteristiques,colors,cepageValues,accordsValues,dialog,json,pastillesValues} from '../components/array/description'
import {connect} from 'react-redux'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import CustomMarker from '../components/markers/customMarker'
import {bindActionCreators} from 'redux';
import {setWine} from '../redux/actions'
import {saveWine} from '../functions/api'
import {checkData} from '../functions/functions'
function mapStateToProps(state){
  return {
    wine : state.wine,
    cellarId : state.cellar._id
    // favorite : state.profile.newWine.wine.favorite
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setWine,saveWine}, dispatch)
}

class EditFile extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    const { params = {} } = navigation.state;
    return {
    headerStyle: {
      backgroundColor: (colors[params.color] || {}).color || 'white',
    },
    headerTintColor: params.color == 'red' ? 'white' : void 0,
    headerRight: params.isDifferent ? ( // display checkLeave only if different
      <Button
        color={params.color == 'red' ? 'white' : 'black'}
        onPress={() => params.checkLeave()}
        title={"Enregistrer"}
      />
    ) : void 0,
    // headerLeft: (
    //   <Button
    //     color={params.color == 'red' ? 'white' : 'black'}
    //     onPress={() => navigation.goBack()}
    //     title={"Annuler"}
    //   />
    // )
  }
  }
  constructor(props){
    super(props);
    this.state = {
      modalColor:'',
      choices : [],
      modalPastille:'',
      wine : {}
    }
  }


  checkLeave = () => {


    this.props.saveWine({...this.props.wine,cellarId:this.props.cellarId},this.props.wine._id)
    this.props.navigation.goBack()

  }
  componentDidUpdate(props,state){

    let newDifferent = checkData(this.props.wine,this.initialProps)
    let oldDifferent = checkData(props.wine,this.initialProps)
    if (newDifferent != oldDifferent) {
      props.navigation.setParams({isDifferent:newDifferent})
    }
  }
  componentDidMount(){
    this.initialProps = Object.assign({favorite:false},this.props.wine)
    this.props.navigation.setParams({isDifferent: false,checkLeave:this.checkLeave})

  }

  render() {
    let backgroundTextColor = this.props.wine.color == 'red' ? 'white' : 'black'

    let {country,region,appelation,annee,before,apogee,typologie,temperature,cuisine_monde,price,vendor,terrain,stock,nez,legumes,viandes,poissons,desserts,aperitif,fromages,bouche,color,domain,carafage,commentaire,photo} = this.props.wine
    let favorite = this.props.wine.favorite || false
    let cepage = this.props.wine.cepage || []
    let pastilles = this.props.wine.pastilles || []



    return (

    <KeyboardAvoidingView behavior='position' keyboardShouldPersistTaps="always" >



      {this.state.modalColor != '' ?
        <ModalSingleChoice
          array={colors}
          data={color}
          close={(object)=> {
            this.setState({modalColor:''})
            this.props.setWine({color:object})
            this.props.navigation.setParams({color: object})
          }}
          />
      : void 0}
      {this.state.choices.length > 0 ?
        <ModalPhotoChoice
          array={this.state.choices}
          data={null}
          close={(id)=>{
            let choice = this.state.choices[id]
            if (id) {
              this.setState({choices:[]})
              this.props.setWine({color:choice.color,appelation:choice.appelation,region:choice.region,country:choice.country})

            }
            else this.setState({choices:[]})
          }}/>
      : void 0}


      {this.state.modalPastille != '' ?
        <ModalMultipleChoice
          array={pastillesValues.values}
          data={pastilles}
          close={(object)=>{
            this.setState({modalPastille:'',wine:{...this.state.wine,pastilles:object}})
          }}/>
      : void 0}

      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" style={{padding:0}}>

      <View style={{...styles.container,justifyContent:'flex-start',backgroundColor:"white",marginBottom:50}}>
        <View style={{...styles.container,flexDirection:'row',alignItems:'flex-start'}}>
          <View style={{flex:3}}>
            {/* <TouchableOpacity onPress={()=>this.props.setWine({favorite:!favorite})} style={{top:10,right:10,alignSelf:'center',position:'absolute',zIndex:10}}>
              <Image style={{
                resizeMode: 'contain',
                height:32
              }} source={favorite ? heartFull : heartEmpty} />
            </TouchableOpacity> */}
            <ManagePhoto
              foundWine={(json)=> {
                if (json.proposition.length == 1){
                  let choice = json.proposition[0]
                  Alert.alert("Recherche fructueuse !",`Nous avons trouvé un vin dans notre base ! : \n ${choice.appelation} (${colors[choice.color].label}) \n ${choice.region}` ,
                  [
                    {text: 'OK', onPress: () => this.setState({wine:{...this.state.wine,annee:json.annee || void 0,color:choice.color,appelation:choice.appelation,region:choice.region,country:choice.country}})},
                    {text: 'Annuler', onPress: () => void 0}
                  ])
                } else {
                  Alert.alert("Recherche fructueuse !",'Nous avons trouvé plusieurs vins dans notre base !',
                  [
                    {text: 'Choisir', onPress: () => this.setState({choices : json.proposition,wine:{...this.state.wine,annee:json.annee || void 0}})},
                    {text: 'Annuler', onPress: () => void 0}
                  ])
                }
              }}
              appelations = {this.appelations}
              addPicture={(photo) => this.props.setWine({photo})}
              photo={photo} />
            </View>
              <View style={{flex:2}}>
                <View style={{}}>

                  <TouchableOpacity onPress={()=>this.props.setWine({favorite:!favorite})} style={{...editFile.cartoucheRight,paddingRight:10}}>
                    <Image style={{
                      resizeMode: 'contain',
                      height:32
                    }} source={favorite ? heartFull : heartEmpty} />
                  </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({modalColor:'modalColor'})}  style={{...editFile.cartoucheRight}}>
                      {/* <View style={{backgroundColor:(colors[color] || {}).color || 'black',borderWidth:1,borderColor:'#bababa',borderRadius:10,width:20,height:20,marginHorizontal:5}}></View> */}
                      <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{(colors[color] || {}).label || 'Couleur'}</Text>
                      <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={editFile.cartoucheRight}
                      onPress={()=>this.refs.typologie.setState({showPicker:true})} >
                        <RNPickerSelect
                           placeholder={{label: 'Typologie',value: ''}}
                           textInputProps={styles.textInputPicker}
                           style={pickerStyle}
                           ref={'typologie'}
                           doneText={'OK'}
                           items={makeTypologieArray()}
                           onValueChange={(typologie) => this.props.setWine({typologie})}
                           value={typologie}
                         />
                         <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>

                    </TouchableOpacity>


                    {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('country')}  style={{...editFile.cartoucheRight}}>
                      <View style={{width:30,height:18}}><Image source={countries['france']} style={{height:20,alignSelf:'center',...images.icon}}/></View>
                      <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{country || 'Pays'}</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('region',{country})}  style={editFile.cartoucheRight}>
                      <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
                      <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{region || 'Région'}</Text>
                    </TouchableOpacity> */}



                    <TouchableOpacity onPress={() => this.props.navigation.navigate('annee',{keyValue:'apogee'})}  style={editFile.cartoucheRight}>
                      {/* <View style={{width:30,height:20}}><Image source={star} style={{height:20,alignSelf:'center',...images.icon}}/></View> */}
                      <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{apogee || "Apogée"}</Text>
                      <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('annee',{keyValue:'before'})}  style={editFile.cartoucheRight}>
                      {/* <View style={{width:30,height:20}}><Image source={history} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View> */}
                      <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{before || "Jusqu'à"}</Text>
                      <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                    </TouchableOpacity>


                  <TouchableOpacity onPress={() => this.refs.carafage.setState({showPicker:true})}  style={editFile.cartoucheRight}>
                    {/* <View style={{width:30,height:20}}><Image source={decanter} style={{height:20,alignSelf:'center',...images.icon}}/></View> */}
                    <RNPickerSelect
                       placeholder={{label: 'Carafage',value: ''}}
                       textInputProps={styles.textInputPicker}
                       style={pickerStyle}
                       ref={'carafage'}
                       doneText={'OK'}
                       items={carafageArray()}
                       onValueChange={(carafage) => this.props.setWine({carafage})}
                       value={carafage}
                     />
                     <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.refs.temperature.setState({showPicker:true})}  style={editFile.cartoucheRight}>
                    {/* <View style={{width:30,height:22}}><Image source={thermometer} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View> */}
                    <RNPickerSelect
                       placeholder={{label: 'Température de service',value: ''}}
                       textInputProps={styles.textInputPicker}
                       style={pickerStyle}
                       ref={'temperature'}
                       doneText={'OK'}
                       items={temperatureArray()}
                       onValueChange={(temperature) => this.props.setWine({temperature})}
                       value={temperature}
                     />
                     <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                  </TouchableOpacity>


                </View>

              </View>


        </View>



        <View style={{...styles.container,paddingHorizontal:10,flexDirection:'row',alignItems:'flex-start',backgroundColor:"#F5F5F5"}}>
          <View style={{...styles.container}}>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('pastilles')} style={{...styles.TouchableOpacity,marginVertical:5,flexWrap:'wrap',justifyContent:'flex-start'}}>
                  {pastilles.length > 0 ?
                    pastilles.map((e,i) => (
                    <View key={i} style={{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'gray',borderRadius:15,padding:5,margin:3}} >
                        <Text style={{color:'#515151',fontSize:15,fontWeight:'600'}}>{e}</Text>
                    </View>
                  )
                ) : <Text style={{...styles.undertitle,borderWidth:1,borderColor:'gray',borderRadius:15,padding:5,margin:3}}>Moments parfaits</Text>}
              </TouchableOpacity>


            <TouchableOpacity onPress={() => this.props.navigation.navigate('region',{country})}  style={{...styles.TouchableOpacity,marginVertical:5,backgroundColor:'white',borderBottomWidth:0}}>
              <View>
                <Text >Region</Text>
                <Text
                  style={styles.appelation} value={domain}
                  >{region || "Region" }</Text>
              </View>

             </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('appelation')} style={{...styles.TouchableOpacity,marginVertical:5,backgroundColor:'white',borderBottomWidth:0}}>
                <View>
                  <Text>Appelation</Text>
                  <Text
                    style={styles.appelation} value={domain}
                    >{appelation || "Indication Géographique" }</Text>
                </View>
               </TouchableOpacity>
             <TouchableOpacity onPress={()=>this.refs.domain.focus()} style={{...styles.TouchableOpacity,marginVertical:5,backgroundColor:'white',borderBottomWidth:0}}>
               <View>
                 <Text>Appelation</Text>
                 <TextInput placeholderTextColor = "#515151"
                   autoCapitalize='words'
                   ref='domain'
                   placeholder={dialog.domain.placeholder}
                   style={styles.appelation} value={domain}
                   onChangeText={(domain)=>this.props.setWine({domain})}/>
              </View>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('annee',{keyValue:'annee'})} style={{...styles.TouchableOpacity,marginVertical:5,backgroundColor:'white',borderBottomWidth:0}}>
              <View>
                <Text>Année</Text>
                <Text style={styles.appelation}>{annee || "Annee"}</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('cepage')} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>
            {/* <View style={{marginLeft:5,width:30,height:30}}><Image source={grapes} style={{alignSelf:'center',...images.icon}}/></View> */}
            <View style={{flex:1}}>
              <Text>Cépage</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center'}}>
              {cepage.length > 0 ?
                cepage.map((e,i) => (
                  <View key={i} style={{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'gray',borderRadius:15,padding:5,margin:3}} >
                      <Text style={{color:'#515151',fontSize:15,fontWeight:'600'}}>{e}</Text>
                  </View>
                ))
                : <Text style={{...styles.undertitle,borderWidth:1,borderColor:'gray',borderRadius:15,padding:5,margin:3}}>Cépages</Text>}
              </View>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={()=>this.refs.price.setState({showPicker:true})} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white',marginTop:40}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingTop:10}}>
              <Text style={{...styles.title}}>Prix : </Text>
                <RNPickerSelect
                   placeholder={{label: 'Prix',value: ''}}
                   textInputProps={{display:'none'}}
                   onDownArrow = {()=>this.refs.stocks.setState({showPicker:true})}
                   onUpArrow = {()=>this.refs.terrain.setState({showPicker:true})}
                   style={{...styles.title}}
                   doneText={'OK'}
                   ref='price'
                   style={{viewContainer:{alignSelf:'center'}}}
                   items={makePriceArray()}
                   onValueChange={(price) => this.props.setWine({price})}
                   value={price}
                 />
              <MultiSlider
                  min={0}
                  selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                  trackStyle={{backgroundColor:'#e6e6e6'}}
                  values={[price||0]}
                  onDownArrow = {()=>this.refs.stocks.setState({showPicker:true})}
                  onUpArrow = {()=>this.refs.terrain.setState({showPicker:true})}
                  sliderLength={250}
                  enabledOne={true}
                  isMarkersSeparated={true}
                  customMarkerLeft={(e) => <CustomMarker
                  active = {true}
                    suffix={'€'}
                   currentValue={e.currentValue}/>
                   }
                  max={100}
                  onValuesChangeFinish={(e)=>this.props.setWine({price:e[0]})}
                />
            </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.refs.stocks.setState({showPicker:true})} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingBottom:10}}>
                  <Text style={{...styles.title}}>Stock : </Text>
                  <RNPickerSelect
                     placeholder={{label: 'En Stock',value: ''}}
                     onUpArrow = {()=>this.refs.price.setState({showPicker:true})}
                     textInputProps={{display:'none'}}
                     style={{...styles.title}}
                     doneText={'OK'}
                     ref='stocks'
                     style={{viewContainer:{alignSelf:'center'}}}
                     items={makeStockArray()}
                     onValueChange={(stock) => this.props.setWine({stock})}
                     value={stock}
                   />
                  <MultiSlider
                    min={0}
                    selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                    trackStyle={{backgroundColor:'#e6e6e6'}}
                    onUpArrow = {()=>this.refs.price.setState({showPicker:true})}
                    values={[stock||0]}
                    sliderLength={250}
                    enabledOne={true}
                    isMarkersSeparated={true}
                    customMarkerLeft={(e) => <CustomMarker
                    active = {true}
                     currentValue={e.currentValue}/>
                     }
                    max={50}
                    onValuesChangeFinish={(e)=>this.props.setWine({stock:e[0]})}
                  />
              </View>
              </TouchableOpacity>
           {/* <View style={{flex:4,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:35,margin:0}}>
             <Text>Vendu par : </Text>
           <TextInput placeholder={'Entreprise'} onChangeText={(vendor) => this.setState({wine:{...this.state.wine,vendor}})}/>
          </View> */}


          <View style={{...styles.container,marginVertical:20}}>
            <Text style={{...styles.title,fontWeight:'700',color:backgroundTextColor,}}>{'ACCORDS'}</Text>
          </View>
          {Object.keys(accordsValues).map((accords,index) => {
            let accord = accordsValues[accords]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('accords',{keyValue:accords})}
                key={index} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',paddingVertical:10,marginVertical:5,backgroundColor:'white'}}>
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
          <View style={{...styles.container,marginVertical:20}}>
            <Text style={{...styles.title,fontWeight:'700',color:backgroundTextColor,}}>{'DEGUSTATION'}</Text>
          </View>
          {Object.keys(json).map((caracts,index) => {
            let caract = json[caracts]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('aromes',{keyValue:caracts})}
                key={index} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',paddingVertical:10,marginVertical:5,backgroundColor:'white'}}>


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

          <View style={{flex:1,height:1,width:"100%"}}></View>

          <Text style={styles.title}>Mon Commentaire :</Text>
          <View style={{flexDirection:'row',alignSelf:'baseline',flexWrap: "wrap"}}>
            <TextInput
            style={{flex:1,padding:10,paddingBottom:30}}
            multiline
            value={commentaire}
            placeholder='Insérez vos notes'
            onChangeText={(commentaire)=>this.props.setWine({commentaire})}/>
          </View>

          {/* <View style={{width:"100%"}}>

            <Accordion
              style={{width:"100%"}}
              sections={SECTIONS}
              activeSections={this.state.activeSections}
              // renderSectionTitle={this._renderSectionTitle}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
              />
          </View> */}




        </View>
        </View>
      </View>

      </ScrollView>

    </KeyboardAvoidingView>




    );
  }
}
const pickerStyle = {
    viewContainer:{alignSelf:'center',paddingHorizontal:0}
  }
const styles = StyleSheet.create({
  TouchableOpacity : {
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',alignItems:'center',
    paddingHorizontal:5},
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
    fontSize: 20,
    color:"#262626",
    alignSelf:'flex-start',
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
  },
  appelation: {
    color:"#262626",
    fontWeight:"800",
    fontSize: 20,
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

export default connect(mapStateToProps,matchDispatchToProps)(EditFile)

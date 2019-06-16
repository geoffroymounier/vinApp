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
import raw from '../components/array/raw'
import {images,editFile} from 'styles'
import {country_code,getCountryCode} from '../components/array/country_code'
import alasql from 'alasql'
import {carafageArray,makeTypologieArray,makePriceArray,makeRegionArray,makeStockArray,terrainArray,makeYearArray,lastYearArray,apogeeArray} from '../components/array/pickers'
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
    headerTitle : 'Editer ce vin',
    headerLeft: (
      <Button
        onPress={() => params.checkLeave()}
        title={"Retour"}
      />
    )
  }
  }
  constructor(props){
    super(props);
    this.state = {
      modal:'',
      modalColor:'',
      modalRegion:'',
      activeSections: [],
      choices : [],
      cepageModal:'',
      modalAccords:'',
      modalAppelation : '',
      modalPastille:'',
      wine : {}
    }
  }


  checkLeave = () => {

    if (!checkData(this.props.wine,this.initialProps) == true) return this.props.navigation.goBack()
    else {
      this.props.saveWine({...this.props.wine,cellarId:this.props.cellarId},this.props.wine._id)
      this.props.navigation.goBack()
      // Alert.alert('Save Data ? ')
    }
  }
  componentDidMount(){
    this.initialProps = Object.assign({},this.props.wine)
    this.props.navigation.setParams({checkLeave: this.checkLeave})
  }

  render() {

    let {country,region,appelation,annee,before,apogee,pastilles,typologie,cuisine_monde,price,vendor,terrain,favorite,stock,nez,legumes,viandes,poissons,desserts,aperitif,fromages,bouche,color,domain,carafage,commentaire,photo} = this.props.wine
    let cepage = this.props.wine.cepage || []



    return (

      <KeyboardAvoidingView behavior='position' keyboardShouldPersistTaps="always" >



      {this.state.modalColor != '' ?
        <ModalSingleChoice
          array={colors}
          data={color}
          close={(object)=> {
            this.setState({modalColor:''})
            this.props.setWine({color:object})
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

      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" style={{padding:0,backgroundColor:"white"}}>

      <View style={{...styles.container,justifyContent:'flex-start',backgroundColor:"white",marginBottom:50}}>
        <View style={{...styles.container,alignItems:'flex-start'}}>
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

        <View style={{...styles.container,paddingVertical:10}}>
          <View style={styles.container}>
            <View style={editFile.cartoucheRow}>
              <TouchableOpacity onPress={()=>this.setState({modalColor:'modalColor'})}  style={editFile.cartoucheLeft}>
                <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap',paddingRight:30}}>{(colors[color] || {}).label || 'Couleur'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={editFile.cartoucheRight}
                onPress={()=>this.refs.typologie.setState({showPicker:true})} >
                <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
                <View style={{flex:1,flexDirection:'row'}}>
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
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',alignSelf:'center',padding:5}}>
              <TouchableOpacity onPress={() => this.props.navigation.push('country')}  style={editFile.cartoucheLeft}>
                <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap',paddingRight:30}}>{country || 'Pays'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.push('region',{country})}  style={editFile.cartoucheRight}>
                <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap',paddingRight:30}}>{region || 'Région'}</Text>
              </TouchableOpacity>
            </View>
            <View style={editFile.cartoucheRow}>
              <TouchableOpacity onPress={() => this.props.navigation.push('annee',{keyValue:'apogee'})}  style={editFile.cartoucheLeft}>
                <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap',paddingRight:30}}>{apogee || "Apogée"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.push('annee',{keyValue:'before'})}  style={editFile.cartoucheRight}>
                <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap',paddingRight:30}}>{before || "Jusqu'à"}</Text>
              </TouchableOpacity>
            </View>
            <View style={editFile.cartoucheRow}>
            <TouchableOpacity onPress={() => this.refs.carafage.setState({showPicker:true})}  style={editFile.cartoucheLeft}>
              <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
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
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.refs.temperature.setState({showPicker:true})}  style={editFile.cartoucheRight}>
              <View style={{width:30,height:20}}><Image source={require('../assets/map-marker-alt.png')} light size={20} color='#515151' style={{height:20,alignSelf:'center',...images.icon}}/></View>
              <RNPickerSelect
                 placeholder={{label: 'Température',value: ''}}
                 textInputProps={styles.textInputPicker}
                 style={pickerStyle}
                 ref={'temperature'}
                 doneText={'OK'}
                 items={carafageArray()}
                 onValueChange={(carafage) => this.props.setWine({temperature})}
                 value={carafage}
               />
            </TouchableOpacity>
          </View>
          </View>
        </View>

        <View style={{...styles.container,flexDirection:'row',alignItems:'flex-start'}}>
          <View style={{...styles.container}}>
          <View style={{borderTopWidth:5,borderBottomWidth:5,paddingVertical:5,borderRadius:0,borderColor:(colors[color] || {}).color || '#515151' ,width:"100%"}}>
              <TouchableOpacity onPress={()=>this.props.navigation.push('appelation')} style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
                <Text
                  style={styles.appelation} value={domain}
                  >{appelation || "Indication Géographique" }</Text>
               </TouchableOpacity>
             <TouchableOpacity onPress={()=>this.refs.domain.focus()} style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
               <TextInput placeholderTextColor = "#515151"
                 autoCapitalize='words'
                 ref='domain'
                 placeholder={dialog.domain.placeholder}
                 style={styles.appelation} value={domain}
                 onChangeText={(domain)=>this.props.setWine({domain})}/>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.push('annee',{keyValue:'annee'})} style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
              <Text style={styles.appelation}>{annee || "Annee"}</Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.push('cepage')} style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
              <View  style={{flexDirection:'row',alignSelf:'baseline',flexWrap: "wrap",alignItems:'center'}}>
              <Text style={styles.undertitle}>{cepageValues.placeholder}</Text>
              {cepage.map((e,i) => (
                <View key={i} style={{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'gray',borderRadius:15,padding:5,margin:3}} >
                    <Text style={{color:'#515151',fontSize:15,fontWeight:'600'}}>{e}</Text>
                </View>
              )
              )}
            </View>
          </TouchableOpacity>

          </View>
          <TouchableOpacity onPress={()=>this.refs.price.setState({showPicker:true})} style={{...styles.TouchableOpacity}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
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
            <TouchableOpacity onPress={()=>this.refs.stocks.setState({showPicker:true})} style={{...styles.TouchableOpacity}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
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


          <View style={{...styles.container,flexDirection:'row',width:'100%',alignItems:'flex-start',backgroundColor:"#eee5da",

            }}>
            <Text style={{...styles.title,fontWeight:'800'}}>{'ACCORDS'}</Text>
          </View>
          {Object.keys(accordsValues).map((accords,index) => {
            let accord = accordsValues[accords]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.push('accords',{keyValue:accords})}
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
                onPress={()=>this.props.navigation.push('aromes',{keyValue:caracts})}
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

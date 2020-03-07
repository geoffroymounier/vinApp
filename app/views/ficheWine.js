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
import {images,ficheWine} from 'styles'
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

class Fiche extends React.Component {
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
            <View style={ficheWine.cartoucheRow}>
              <View style={{...ficheWine.cartoucheRight,minHeight:50}}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{'Couleur'}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{(colors[color] || {}).label || 'Couleur'}</Text>
              </View>
              <View style={{...ficheWine.cartoucheRight,minHeight:50}}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Typologie"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{typologie}</Text>
              </View>
              <View style={{...ficheWine.cartoucheRight,minHeight:50}}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Apogée"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{apogee}</Text>
              </View>
              <View style={{...ficheWine.cartoucheRight,minHeight:50}}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Garde"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{before}</Text>
              </View>
            </View>
            <View style={ficheWine.cartoucheRow}>
              <View style={ficheWine.cartoucheLeft}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Pays"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{country}</Text>
              </View>
              <View style={ficheWine.cartoucheLeft}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Région"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{region}</Text>
              </View>
            </View>
            <View style={ficheWine.cartoucheRow}>
              <View style={ficheWine.cartoucheLeft}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Carafage"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{carafage}</Text>
              </View>
              <View style={ficheWine.cartoucheRight}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Alcool"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}></Text>
              </View>
              <View style={ficheWine.cartoucheRight}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Prix"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{price}</Text>
              </View>
              <View style={ficheWine.cartoucheRight}>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{"Stock"}</Text>
                <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{stock}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{...styles.container,flexDirection:'row',alignItems:'flex-start'}}>
          <View style={{...styles.container}}>
          <View style={{borderTopWidth:5,borderBottomWidth:5,paddingVertical:5,borderRadius:0,borderColor:(colors[color] || {}).color || '#515151' ,width:"100%"}}>
              <View  style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
                <Text
                  style={styles.appelation} value={domain}
                  >{appelation || "Indication Géographique" }</Text>
               </View>
             <View  style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
               <Text style={styles.appelation}>{domain}</Text>
            </View>
            <View style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
              <Text style={styles.appelation}>{annee || "Annee"}</Text>
          </View>
            <View style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
              <View  style={{flexDirection:'row',alignSelf:'baseline',flexWrap: "wrap",alignItems:'center'}}>
              <Text style={styles.undertitle}>{cepageValues.placeholder}</Text>
              {cepage.map((e,i) => (
                <View key={i} style={{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'gray',borderRadius:15,padding:5,margin:3}} >
                    <Text style={{color:'#515151',fontSize:15,fontWeight:'600'}}>{e}</Text>
                </View>
              )
              )}
            </View>
          </View>
          </View>
          <View style={{...styles.container,flexDirection:'row',width:'100%',alignItems:'flex-start',backgroundColor:"#eee5da",

            }}>
            <Text style={{...styles.title,fontWeight:'800'}}>{'ACCORDS'}</Text>
          </View>
          {Object.keys(accordsValues).map((accords,index) => {
            let accord = accordsValues[accords]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('accords',{keyValue:accords})}
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
                onPress={()=>this.props.navigation.navigate('aromes',{keyValue:caracts})}
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
    textAlign:'center',
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

export default connect(mapStateToProps,matchDispatchToProps)(Fiche)

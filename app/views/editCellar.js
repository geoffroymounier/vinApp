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
import CustomMarker from '../components/markers/customMarker'
import {bindActionCreators} from 'redux';
import {setCellar} from '../redux/actions'
import {saveCellar} from '../functions/api'
import {checkData} from '../functions/functions'
function mapStateToProps(state){
  return {
    cellar : state.cellar
    // favorite : state.profile.newWine.cellar.favorite
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setCellar,saveCellar}, dispatch)
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
    }
  }


  checkLeave = () => {

    if (!checkData(this.props.cellar,this.initialProps) == true) return this.props.navigation.goBack()
    else {
      this.props.saveCellar({...this.props.cellar},this.props.cellar._id)
      this.props.navigation.goBack()
      // Alert.alert('Save Data ? ')
    }
  }
  componentDidMount(){
    this.initialProps = Object.assign({},this.props.cellar)
    this.props.navigation.setParams({checkLeave: this.checkLeave})
  }

  render() {

    let {name,description,commentaire} = this.props.cellar


    return (

      <KeyboardAvoidingView behavior='position' keyboardShouldPersistTaps="always" >

      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" style={{padding:0,backgroundColor:"white"}}>

      <View style={{...styles.container,justifyContent:'flex-start',backgroundColor:"white",marginBottom:50}}>
        {/* <View style={{...styles.container,alignItems:'flex-start'}}>
          <ManagePhoto
            foundWine={(json)=> {
              if (json.proposition.length == 1){
                let choice = json.proposition[0]
                Alert.alert("Recherche fructueuse !",`Nous avons trouvé un vin dans notre base ! : \n ${choice.appelation} (${colors[choice.color].label}) \n ${choice.region}` ,
                [
                  {text: 'OK', onPress: () => this.setState({wine:{...this.state.cellar,annee:json.annee || void 0,color:choice.color,appelation:choice.appelation,region:choice.region,country:choice.country}})},
                  {text: 'Annuler', onPress: () => void 0}
                ])
              } else {
                Alert.alert("Recherche fructueuse !",'Nous avons trouvé plusieurs vins dans notre base !',
                [
                  {text: 'Choisir', onPress: () => this.setState({choices : json.proposition,wine:{...this.state.cellar,annee:json.annee || void 0}})},
                  {text: 'Annuler', onPress: () => void 0}
                ])
              }
            }}
            appelations = {this.appelations}
            addPicture={(photo) => this.props.setCellar({photo})}
            photo={photo} />
        </View> */}



        <View style={{...styles.container,flexDirection:'row',alignItems:'flex-start'}}>
          <View style={{...styles.container}}>
          <View style={{borderTopWidth:5,borderBottomWidth:5,paddingVertical:5,width:"100%"}}>
              <TouchableOpacity onPress={()=>this.refs.name.focus()} style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
                <TextInput placeholderTextColor = "#515151"
                  autoCapitalize='words'
                  multiline
                  ref='name'
                  placeholder={'Nom de la Cave'}
                  style={styles.appelation} value={name}
                  onChangeText={(name)=>this.props.setCellar({name})}/>
               </TouchableOpacity>
             <TouchableOpacity onPress={()=>this.refs.description.focus()} style={{...styles.TouchableOpacity,borderBottomWidth:0}}>
               <TextInput placeholderTextColor = "#515151"
                 autoCapitalize='words'
                 multiline
                 ref='description'
                 placeholder={'Description'}
                 style={styles.appelation} value={description}
                 onChangeText={(description)=>this.props.setCellar({description})}/>
              </TouchableOpacity>
          </View>



          <Text style={styles.title}>Mon Commentaire :</Text>
          <View style={{flexDirection:'row',alignSelf:'baseline',flexWrap: "wrap"}}>
            <TextInput
            style={{flex:1,padding:10,paddingBottom:30}}
            multiline
            value={commentaire}
            placeholder='Insérez vos notes'
            onChangeText={(commentaire)=>this.props.setCellar({commentaire})}/>
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

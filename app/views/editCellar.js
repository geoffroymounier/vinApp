import React, {Component} from 'react';
import {Button,Keyboard,Dimensions,Platform, Alert,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity} from 'react-native';
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
const { height, width } = Dimensions.get('window');
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

  constructor(props){
    super(props);
    this.state = {
    }
  }


  checkSave = () => {

    if (!checkData(this.props.cellar,this.initialProps) == true) return this.props.navigation.goBack()
    else {
      this.props.saveCellar({...this.props.cellar},this.props.cellar._id)
      this.props.navigation.goBack()
      // Alert.alert('Save Data ? ')
    }
  }
  componentDidMount(){
    this.initialProps = Object.assign({},this.props.cellar)
  }

  render() {

    let {name,description,commentaire} = this.props.cellar
    return (
      <TouchableOpacity activeOpacity={1} onPress={()=>Keyboard.dismiss()} style={{flex:1,justifyContent:'flex-end'}}>
      <KeyboardAvoidingView behavior='padding'  keyboardShouldPersistTaps="never" >
        <View style={{alignSelf:'flex-end',width,backgroundColor:'#FCF7F7',borderRadius:20}}>
          <Text style={{...styles.title,alignSelf:'center',color:'#5D5D5D'}}>Editer la cave</Text>
            <View style={{flexDirection:'row',alignItems:'flex-start'}}>
              <View style={{flex:1}}>

                  <TouchableOpacity onPress={()=>this.refs.name.focus()} style={{margin:10,padding:4,backgroundColor:'white'}}>
                    <Text style={{fontSize:14,color:'#848484'}}>Nom</Text>
                    <TextInput placeholderTextColor = "#848484"
                      autoCapitalize='words'
                      ref='name'
                      placeholder={'Nom de la Cave'}
                      style={styles.appelation} value={name}
                      onChangeText={(name)=>this.props.setCellar({name})}/>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>this.refs.description.focus()} style={{margin:10,padding:4,backgroundColor:'white'}}>
                     <Text style={{fontSize:14,color:'#848484'}}>Description</Text>
                     <TextInput placeholderTextColor = "#515151"
                       autoCapitalize='words'
                       ref='description'
                       placeholder={'Description'}
                       style={styles.appelation} value={description}
                       onChangeText={(description)=>this.props.setCellar({description})}/>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={()=>this.refs.commentaire.focus()} style={{margin:10,padding:4,backgroundColor:'white'}}>
                      <Text style={{fontSize:14,color:'#848484'}}>Commentaire</Text>
                      <TextInput placeholderTextColor = "#515151"
                        autoCapitalize='words'
                        ref='commentaire'
                        placeholder='Insérez vos notes'
                        placeholder={'Description'}
                        multiline
                        style={styles.appelation} value={commentaire}
                        onChangeText={(commentaire)=>this.props.setCellar({commentaire})}/>
                     </TouchableOpacity> */}
                     <View style={{flexDirection:'row'}}>
                       <TouchableOpacity
                         style={{margin:10,marginHorizontal:30,flex:1,height:40,borderRadius:100,backgroundColor:'#D72032'}}
                         onPress={()=>{
                           this.checkSave()
                         }}
                         >
                           <Text
                               style={{
                               textAlign: "center",
                               padding: 10,
                               color: "white",
                               fontSize: 14
                           }}>Sauvegarder</Text>
                         </TouchableOpacity>
                         <TouchableOpacity
                           style={{margin:10,marginHorizontal:30,flex:1,height:40,borderRadius:100,borderWidth:1,backgroundColor:'#F3F3F3',borderColor:'#979797'}}
                           onPress={()=>{
                             this.props.navigation.goBack()
                           }}
                           >
                             <Text
                                 style={{
                                 textAlign: "center",
                                 padding: 10,
                                 color: "#5D5D5D",
                                 fontSize: 14
                             }}>Annuler</Text>
                           </TouchableOpacity>

                     </View>


              </View>
            </View>
        </View>

        </KeyboardAvoidingView>
        </TouchableOpacity>







    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    alignSelf:'flex-start',
    textAlign: 'left',
    margin: 10,
  },
  appelation: {
    color:'#848484',
    fontWeight:"600",
    fontSize: 16,
    alignSelf:'flex-start',
    textAlign: 'left',
    marginVertical: 3,
  },
});

export default connect(mapStateToProps,matchDispatchToProps)(EditFile)

import React, {Component} from 'react';
import {TouchableOpacity,Modal,Text,View,Image,Dimensions,Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {colors} from '../array/description'
import raw from '../array/raw'
import alasql from 'alasql'
import RNMlKit from 'react-native-firebase-mlkit';
const cameraRetro = require('../../assets/camera-retro.png')
const Buffer = require('buffer').Buffer

const { height, width } = Dimensions.get('window');
// function mapStateToProps(state,props){
//   return {
//     picture : (state.pictures||[]).find(p => p.wineId == props.wineId)
//     // favorite : state.profile.newWine.wine.favorite
//   }
// }
export default class ManagePhoto extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {};
  }
  manageImage(e) {

      var self = this
      const options = {
        title: "Votre photo",
        storageOptions: {
          skipBackup: true,
          path: "images"
        },
        cancelButtonTitle:'Annuler',
        mediaType: "photo",
        quality: 0.3,
        allowsEditing: true,
        takePhotoButtonTitle: null,
        cancelButtonTitle:'Annuler',
        chooseFromLibraryButtonTitle: null,
        customButtons : [
          {name:'erasePhoto',title:'Supprimer cette photo'},
          {name:'findWine',title:'Trouver un Vin'},
          {name:'open',title:'Afficher en Grand'}
        ]
      };

      ImagePicker.showImagePicker(options, response => {


        if (response.customButton) {

          switch (response.customButton) {
            case "erasePhoto":
              let source = { uri: null};
              this.props.addPicture(source.uri)
              break;
            case "findWine":
              this.findWine(this.props.photo)
              break;
              case "open":
            this.setState({visible:true})
            break;
            default: break;

          }
        }

      });
    }
  findWine(uri){
    RNMlKit.deviceTextRecognition(uri).then((deviceTextRecognition)=>{
      // console.log('Text Recognition On-Device', deviceTextRecognition.res);
      // alert(deviceTextRecognition.resultText)
      let results = []
      for (var i in deviceTextRecognition){
        if (deviceTextRecognition[i].resultText) results.push(...deviceTextRecognition[i].resultText.toLowerCase().split(/\'|\.|,|\s|\n/g))
      }

      let acc = results.reduce((acc,r,i) => acc + (i == 0 ? '' : ',') + '"' + r + '"','')

      let appelations =  alasql('SELECT * FROM ? WHERE LOWER(region) IN ('+acc+')  ' ,[raw])

      let json = {}
      let proposition = []
      let choice = []
      let annee;
      let array = []
      for (var i in results){

        // console.log(results[i])
        if ((/(19|20)\d{2}/).test(results[i].replace(/\s/g,''))) json.annee = parseInt(results[i].replace(/\s/g,''))
        else {
          for (var j in appelations){
            let normalizeAppelation = (appelations[j].appelation || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\-/g,' ')
            let normalizeString = (results[i] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\-/g,' ')
            // console.log(normalizeString)
            if (normalizeAppelation.match(normalizeString) && !array.includes(j)) {
              let colorArray = appelations[j].color || ["red","white","rose"]
              array.push(j)
              for (var i in colorArray){
                proposition.push({
                  region : appelations[j].region,
                  appelation : appelations[j].appelation,
                  country : appelations[j].country,
                  country_code : appelations[j].country_code,
                  color_code : colors[colorArray[i]].color,
                  color : colorArray[i]
                })

              }
            }
          }
        }
      }
      json.proposition = proposition
      if (proposition.length >= 1){
        // Alert.alert("Recherche fructueuse !",'Nous avons trouvé un vin dans notre base !')
        this.props.foundWine(json)
      } else if (proposition.length > 1) {
        // Alert.alert("Recherche fructueuse !",'Nous avons trouvé plusieurs vins potentiels !')
        this.props.foundWine(json)
      } else {
        Alert.alert("Recherche infructueuse","Nous n'avons trouvé aucun vin dans notre base...")
        // notuhing
      }
    }).catch((e) => {
      console.log(e)
      console.log('error')
      // console.log(e);
    })
  }
  uploadAvatar() {


      var self = this
      const options = {
        title: "",
        storageOptions: {
          skipBackup: true,
          path: "images"
        },
        mediaType: "photo",
        quality: 0.1,
        allowsEditing: true,
        takePhotoButtonTitle: "Prenez une photo",
        cancelButtonTitle:'Annuler',
        chooseFromLibraryButtonTitle: "Choisissez une photo",
        permissionDenied : {
          title:"Accès refusé",
          text:"Vous devez autoriser l'accès à la caméra",
          reTryTitle:"Reéssayer",
          okTitle:"OK"
        }
      }

      ImagePicker.showImagePicker(options, response => {

        if (response.didCancel) {
          //
        } else if (response.error) {
          //
        } else if (response.customButton) {
          //
        } else {
          let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.props.addPicture(source.uri)
          this.findWine(source.uri)
        }

      });
    }


  render(){
    let base64 = this.props.photo ? new Buffer(this.props.photo).toString() : null
    return(
      <TouchableOpacity
        onPress={()=>{ this.props.photo ? this.manageImage() : this.uploadAvatar()
      }}
      style={{
              width: '100%',
              backgroundColor:'#CCCCCC',
              borderBottomRightRadius:40,
              alignSelf:'center',

              justifyContent: 'center',
              alignItems: 'center',flex:1,
              overflow:'hidden'
            }}>
      <View style={{width:"100%",height:"100%",justifyContent:'center'}}>
        {this.state.visible ?
          <Modal
            animationType="slide"
            supportedOrientations={["landscape", "portrait"]}
            >
            <View style={{height}}>
            <Image
              style={{flex:1}}
              source={{uri: this.props.photo}}
            />
            <TouchableOpacity
              style={{position:'absolute',width,bottom:20,height:50,backgroundColor:"rgba(83, 0, 0,0.9)",alignItems:'center',justifyContent:'center'}}
              onPress={()=>this.setState({visible:false})}
            >
            <Text
                style={{
                textAlign: "center",
                padding: 10,
                fontWeight: "bold",
                fontSize: 16,
                color:"white"
            }}>Fermer</Text>
            </TouchableOpacity>
          </View>
          </Modal>
          : void 0}

      {this.props.photo ?
      <Image
        style={{height:"100%",width:"100%"}}
        source={{uri: base64}}
      />
      :
      <Image
        resizeMode='contain'
        style={{justifyContent:'center',alignSelf:'center',height:64}}
        source={cameraRetro}
      />}
        </View>
      </TouchableOpacity>

    )
  }
}

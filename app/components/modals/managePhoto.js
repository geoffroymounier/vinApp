import React, {Component} from 'react';
import {TouchableOpacity,Modal,Text,View,Image,Dimensions,Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from '../markers/icon.js';
import {colors} from '../array/description'
const cameraRetro = require('../../assets/camera-retro.png')

import RNMlKit from 'react-native-firebase-mlkit';
const { height, width } = Dimensions.get('window');
export default class ManagePhoto extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {};
  }
  uploadImage(uri, mime = 'application/octet-stream') {
    var self = this
    return new Promise((resolve, reject) => {
     self.setState({update:true})
     let counter = Math.floor((Math.random() * 100) + 1);
     const imageRef = firebase.storage().ref('image/' + self.props.uid).child('photo_' + counter);
         var uploadTask = imageRef.put(uri, { contentType: mime })
         uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const totalBytes = snapshot.totalBytes
            self.setState({progress:(snapshot.bytesTransferred / totalBytes)})
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'

                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'

                break;
            }
          }, function(error) {
              self.setState({update:false})
              reject(error)
          }, function() {

            imageRef.getDownloadURL().then(function(downloadURL) {
              self.setState({update:false})
              resolve(downloadURL);
            })
            .catch((error) => {
              self.setState({update:false})
              reject(error)
            })
          })
     })

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
        quality: 1,
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
      let result = ''
      for (var i in deviceTextRecognition){
        if (deviceTextRecognition[i].resultText) result = (deviceTextRecognition[i].resultText)
      }

      let results = result.split(/\n/)

      const appelations = this.props.appelations
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
        quality: 1,
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
    return(
      <TouchableOpacity
        onPress={()=>{ this.props.photo ? this.manageImage() : this.uploadAvatar()
      }}
      style={{
              width,
              // backgroundColor:'red',
              height:150,
              justifyContent: 'center',
              alignItems: 'center',flex:1,
              overflow:'hidden'
            }}>
      <View>
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
        style={{width,height: 200}}
        source={{uri: this.props.photo}}
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

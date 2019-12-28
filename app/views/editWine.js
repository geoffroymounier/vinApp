import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient'
import {Button,Platform, Alert,StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,TextInput,Picker,TouchableOpacity} from 'react-native';
import ModalMultipleChoice from '../components/modals/modalMultipleChoice.js'
import ModalSingleChoice from '../components/modals/modalSingleChoice.js'
import ModalPhotoChoice from '../components/modals/modalPhotoChoice.js'
import RNPickerSelect from 'react-native-picker-select';
import ManagePhoto from '../components/modals/managePhoto'
const arrowRight = require('../assets/arrow-right.png')
const heartEmpty = require('../assets/heart-empty.png')
const heartFull = require('../assets/heart-full.png')
const countries = require('../assets/countries/index.js').default
import {images,editFile} from 'styles'
import {country_code,getCountryCode} from '../components/array/country_code'
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
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setWine,saveWine}, dispatch)
}

class EditFile extends React.Component {
  static navigationOptions = ({ navigation  }) => {
    const { params = {} } = navigation.state;
    return {
    headerBackground: (
      <LinearGradient
        start={{x: 0, y: 0}}
        style={{flex:1}}
        end={{x: 1, y: 0}} colors={
          (colors[params.color] || {}).color == '#FFC401' ? ['#FAFFC3','#FFD49A']
          :(colors[params.color] || {}).color == '#F89BA4' ? ['#FF949E','#FF5C75']
          : [ '#9F041B','#E02535']}
      />
    ),
    headerTintColor : (colors[params.color]||{}).color == '#FFC401' ?  '#939393' : 'white',
    headerRight: params.isDifferent ? ( // display checkLeave only if different
      <Button
        color={(colors[params.color]||{}).color == '#FFC401' ?  '#939393' : 'white'}
        onPress={() => params.checkLeave()}
        title={"Enregistrer"}
      />
    ) : void 0,
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
    let {
      sucre,
      acide,
      tanin,
      corps,
      longueur,
      country,
      region,
      appelation,
      annee,
      before,
      apogee,typologie,temperature,cuisine_monde,price,vendor,terrain,stock,nez,legumes,viandes,poissons,desserts,aperitif,fromages,bouche,color,domain,carafage,commentaire,photo} = this.props.wine
    let favorite = this.props.wine.favorite || false
    let cepage = this.props.wine.cepage || []
    let pastilles = this.props.wine.pastilles || []

    let backgroundTextColor = (colors[color]||{}).color == '#FFC401' ?  '#939393' : 'white'
    let backgroundColor = (colors[color]||{}).color || '#e6e6e6'
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
              this.props.navigation.setParams({color:choice.color})
            }
            else this.setState({choices:[]})
          }}/>
      : void 0}

      <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" style={{padding:0,backgroundColor:'#F5F5F5'}}>

      <View style={{...styles.container,justifyContent:'flex-start',backgroundColor:"white",marginBottom:50}}>
        <View style={{...styles.container,flexDirection:'row',alignItems:'flex-start'}}>
          <View style={{flex:3}}>
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
                <View>

                  <View style={{...editFile.cartoucheRight,paddingHorizontal:10,justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('country')} >
                      <Image style={{
                        resizeMode: 'contain',
                        height:32,
                      }} source={countries[country] || countries['france']} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.props.setWine({favorite:!favorite})} >
                      <Image
                        style={{
                        resizeMode: 'contain',
                        height:32
                      }} source={favorite ? heartFull : heartEmpty} />
                  </TouchableOpacity>
                </View>
                    <TouchableOpacity onPress={()=>this.setState({modalColor:'modalColor'})}  style={{...editFile.cartoucheRight}}>
                      <View style={{flexDirection:'row',flexWrap:'wrap',flex:0.9,justifyContent:'flex-end'}}>
                        <Text style={{...styles.textInputLabel,flexWrap:'wrap'}}>{'Couleur du vin'}</Text>
                        {color && <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{(colors[color] || {}).label || ''}</Text>}
                      </View>
                      <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={editFile.cartoucheRight}
                      onPress={()=>this.refs.typologie.setState({showPicker:true})} >
                        <View style={{flexDirection:'row',flexWrap:'wrap',flex:0.9,justifyContent:'flex-end'}}>
                          <Text style={{...styles.textInputLabel,flexWrap:'wrap'}}>{'Typologie'}</Text>
                          {typologie &&<Text style={{...styles.textInputPicker,flexWrap:'wrap',textAlign:'right'}}>{makeTypologieArray()[typologie].label}</Text>}
                          <RNPickerSelect
                               placeholder={{label: 'Typologie',value: ''}}
                               textInputProps={{height:0}}
                               ref={'typologie'}
                               doneText={'OK'}
                               items={makeTypologieArray()}
                               onValueChange={(typologie) => this.props.setWine({typologie})}
                               value={typologie}
                             />
                        </View>
                         <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('annee',{keyValue:'apogee'})}  style={editFile.cartoucheRight}>
                      <View style={{flexDirection:'row',flexWrap:'wrap',flex:0.9,justifyContent:'flex-end'}}>
                        <Text style={{...styles.textInputLabel,flexWrap:'wrap'}}>{'Apogée'}</Text>
                        {apogee && <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{apogee || ""}</Text>}
                      </View>
                    <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('annee',{keyValue:'before'})}  style={editFile.cartoucheRight}>
                      <View style={{flexDirection:'row',flexWrap:'wrap',flex:0.9,justifyContent:'flex-end'}}>
                        <Text style={{...styles.textInputLabel,flexWrap:'wrap'}}>{"Jusqu' à"}</Text>
                        {before && <Text style={{...styles.textInputPicker,flexWrap:'wrap'}}>{before}</Text>}
                      </View>
                      <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                    </TouchableOpacity>


                  <TouchableOpacity onPress={() => this.refs.carafage.setState({showPicker:true})}  style={editFile.cartoucheRight}>
                    <View style={{flexDirection:'row',flexWrap:'wrap',flex:0.9,justifyContent:'flex-end'}}>
                      <Text style={{...styles.textInputLabel,flexWrap:'wrap'}}>{"Carafage"}</Text>
                      {carafage &&<Text style={{...styles.textInputPicker,flexWrap:'wrap',textAlign:'right'}}>{carafageArray()[carafage].label}</Text>}
                      <RNPickerSelect
                         placeholder={{label: 'Non Précisé',value: ''}}
                         textInputProps={{height:0}}
                         ref={'carafage'}
                         doneText={'OK'}
                         items={carafageArray()}
                         onValueChange={(carafage) => this.props.setWine({carafage})}
                         value={carafage}
                        />
                      </View>
                     <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.refs.temperature.setState({showPicker:true})}  style={{...editFile.cartoucheRight}}>

                    <View style={{flexWrap:'wrap',flex:0.9,justifyContent:'flex-end',}}>
                        <Text style={{...styles.textInputLabel,flexWrap:'wrap',textAlign:'right'}}>{"Température de service"}</Text>
                        {temperature &&<Text style={{...styles.textInputPicker,flexWrap:'wrap',textAlign:'right'}}>{temperatureArray()[temperature].label}</Text>}
                        <RNPickerSelect
                           placeholder={{label: 'Non précisé',value: ''}}
                           textInputProps={{height:0}}
                           ref={'temperature'}
                           doneText={'OK'}
                           items={temperatureArray()}
                           onValueChange={(temperature) => this.props.setWine({temperature})}
                           value={temperature}
                         />
                    </View>


                     <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                  </TouchableOpacity>


                </View>

              </View>


        </View>



        <View style={{...styles.container,paddingHorizontal:10,flexDirection:'row',alignItems:'flex-start',backgroundColor:"#F5F5F5"}}>
          <View style={{...styles.container}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('pastilles')} style={{...styles.TouchableOpacity,marginVertical:5,flexWrap:'wrap',justifyContent:'flex-start',backgroundColor:'transparent'}}>
                  {pastilles.length > 0 ?
                    pastilles.map((e,i) => (
                    <View key={i} style={{backgroundColor:backgroundColor,flexDirection:'row',alignItems:'center',borderRadius:20,padding:8,margin:3}} >
                        <Text style={{color:backgroundTextColor,fontSize:14,padding:5}}>{e}</Text>
                    </View>
                  )
                ) : <Text style={{...styles.undertitle,borderWidth:1,color:"#6D6D6D",borderColor:backgroundColor,borderRadius:20,padding:8,margin:3}}>Moments parfaits</Text>}
              </TouchableOpacity>


            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('region',{country})}  style={styles.TouchableOpacity}>
              <View>
                {!region && <Text style={styles.label}>Region</Text>}
                <Text
                  style={styles.appelation} value={domain}
                  >{region || "Region" }</Text>
              </View>
              <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
             </TouchableOpacity> */}
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('appelation')} style={styles.TouchableOpacity}>
                <View>
                  <Text style={styles.label}>Indication Géographique</Text>
                  <Text
                    style={styles.appelation} value={domain}
                    >{appelation || "Indication Géographique" }</Text>
                  {region &&
                    <Text
                      style={styles.region} value={domain}
                      >{region || "Region" }</Text>
                  }
                </View>
                <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
               </TouchableOpacity>
             <TouchableOpacity onPress={()=>this.refs.domain.focus()} style={styles.TouchableOpacity}>
               <View>
                 <Text style={styles.label}>Domaine</Text>
                 <TextInput placeholderTextColor = "#515151"
                   autoCapitalize='words'
                   ref='domain'
                   placeholder={dialog.domain.placeholder}
                   style={styles.appelation} value={domain}
                   onChangeText={(domain)=>this.props.setWine({domain})}/>
              </View>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('annee',{keyValue:'annee'})} style={styles.TouchableOpacity}>
              <View>
                <Text style={styles.label}>Millésime</Text>
                <Text style={styles.appelation}>{annee || "Annee"}</Text>
              </View>
              <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('cepage')} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>
            {/* <View style={{marginLeft:5,width:30,height:30}}><Image source={grapes} style={{alignSelf:'center',...images.icon}}/></View> */}
            <View style={{flex:1}}>
              <Text style={styles.label}>Cépage</Text>
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
            <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
          </TouchableOpacity>


          <TouchableOpacity onPress={()=>this.refs.price.setState({showPicker:true})} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white',marginTop:40}}>

              <Text style={styles.label}>Prix : </Text>
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
                  // sliderLength={250}
                  containerStyle={{marginLeft:10,alignItems:'center'}}
                  selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                  trackStyle={{backgroundColor:'#e6e6e6'}}
                  values={[price||0]}
                  onDownArrow = {()=>this.refs.stocks.setState({showPicker:true})}
                  onUpArrow = {()=>this.refs.terrain.setState({showPicker:true})}


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


            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.refs.stocks.setState({showPicker:true})} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>
                  <Text style={styles.label}>Stock : </Text>
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
                    containerStyle={{marginLeft:10,alignItems:'center'}}
                    selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                    trackStyle={{backgroundColor:'#e6e6e6'}}
                    onUpArrow = {()=>this.refs.price.setState({showPicker:true})}
                    values={[stock||0]}
                    enabledOne={true}
                    isMarkersSeparated={true}
                    customMarkerLeft={(e) => <CustomMarker
                    active = {true}
                     currentValue={e.currentValue}/>
                     }
                    max={50}
                    onValuesChangeFinish={(e)=>this.props.setWine({stock:e[0]})}
                  />
              </TouchableOpacity>
          <View style={{...styles.container,marginVertical:20}}>
            <Text style={{...styles.title,fontSize:26,color:"#6D6D6D"}}>{'Accords'}</Text>
          </View>
          {Object.keys(accordsValues).map((accords,index) => {
            let accord = accordsValues[accords]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('accords',{keyValue:accords})}
                key={index} style={{...styles.TouchableOpacity,flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start'}}>
                <View style={{flexDirection:'row'}}>
                  <Image  source={accord.icon} style={{marginHorizontal:10,width:24,height:24,tintColor:backgroundColor}}/>
                  <Text style={styles.label}>{accord.label}</Text>
                  <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                </View>
              <View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center'}}>
              {(this.props.wine[accords]||[]).map((e,i) => {
                return (
                  <View key={i}
                    style={{flexDirection:'row',alignItems:'center',
                      paddingHorizontal:10,
                      margin:3,
                      shadowRadius: 3,
                      height:25,borderWidth:1,borderColor:'#6D6D6D',borderRadius:15}} >
                      <Text style={{fontSize:15,color:'#6D6D6D'}}>{e}</Text>
                  </View>

                )
              })}
            </View>
            </TouchableOpacity>
            )

          })}
          <View style={{...styles.container,marginVertical:20}}>
            <Text style={{...styles.title,fontSize:26,color:"#6D6D6D"}}>{'Dégustation'}</Text>
          </View>
          {Object.keys(json).map((caracts,index) => {
            let caract = json[caracts]
            return (
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('aromes',{keyValue:caracts})}
                key={index} style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',paddingVertical:10,marginVertical:5,backgroundColor:'white'}}>
                <View style={{flexDirection:'row'}}>
                  <Image  source={caract.icon} style={{marginHorizontal:10,width:24,height:24,tintColor:backgroundColor}}/>
                  <Text style={styles.label}>{caract.label}</Text>
                  <View style={{width:30,height:15,alignSelf:'center'}}><Image source={arrowRight} style={{...images.icon,tintColor:'gray'}}/></View>
                </View>
                <View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center'}}>
              {(this.props.wine[caracts]||[]).map((e,i) => {
                return (
                  <View key={i}
                    style={{flexDirection:'row',alignItems:'center',
                      paddingHorizontal:10,
                      margin:3,
                      shadowRadius: 3,
                      height:25,borderWidth:1,borderColor:'#6D6D6D',borderRadius:15}} >
                      <Text style={{fontSize:15,color:'#6D6D6D'}}>{e}</Text>
                  </View>

                )
              })}
            </View>

            </TouchableOpacity>
            )

          })}

          <TouchableOpacity style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>
                <Text style={styles.label}>Sucrosité</Text>
                <MultiSlider
                  min={0}
                  snapped
                  sliderLength={250}
                  containerStyle={{marginLeft:10,alignItems:'center'}}
                  selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                  trackStyle={{backgroundColor:'#e6e6e6'}}
                  values={[sucre||0]}
                  enabledOne={true}
                  isMarkersSeparated={true}
                  max={8}
                  onValuesChangeFinish={(e)=>this.props.setWine({sucre:e[0]})}
                />
            </TouchableOpacity>
          <TouchableOpacity style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>

                <Text style={styles.label}>Acidité</Text>
                <MultiSlider
                  min={0}
                  snapped
                  sliderLength={250}
                  containerStyle={{marginLeft:10,alignItems:'center'}}
                  selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                  trackStyle={{backgroundColor:'#e6e6e6'}}
                  values={[acide||0]}
                  enabledOne={true}
                  isMarkersSeparated={true}
                  max={8}
                  onValuesChangeFinish={(e)=>this.props.setWine({acide:e[0]})}
                />
            </TouchableOpacity>

          <TouchableOpacity style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>
                <Text style={styles.label}>Tanins</Text>
                <MultiSlider
                  min={0}
                  snapped
                  sliderLength={250}
                  containerStyle={{marginLeft:10,alignItems:'center'}}
                  selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                  trackStyle={{backgroundColor:'#e6e6e6'}}
                  values={[tanin||0]}
                  enabledOne={true}
                  isMarkersSeparated={true}
                  max={6}
                  onValuesChangeFinish={(e)=>this.props.setWine({tanin:e[0]})}
                />

            </TouchableOpacity>
          <TouchableOpacity style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>
                <Text style={styles.label}>Corps</Text>
                <MultiSlider
                  min={0}
                  snapped
                  sliderLength={250}
                  containerStyle={{marginLeft:10,alignItems:'center'}}
                  selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                  trackStyle={{backgroundColor:'#e6e6e6'}}
                  values={[corps||0]}
                  enabledOne={true}
                  isMarkersSeparated={true}
                  max={6}
                  onValuesChangeFinish={(e)=>this.props.setWine({corps:e[0]})}
                />

            </TouchableOpacity>
          <TouchableOpacity style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',marginVertical:5,backgroundColor:'white'}}>

                <Text style={styles.label}>Longueur</Text>
                <MultiSlider
                  min={0}
                  snapped
                  sliderLength={250}
                  containerStyle={{marginLeft:10,alignItems:'center'}}
                  selectedStyle={{backgroundColor:(colors[color]||{}).color || '#e6e6e6'}}
                  trackStyle={{backgroundColor:'#e6e6e6'}}
                  values={[longueur||0]}
                  enabledOne={true}
                  isMarkersSeparated={true}
                  max={8}
                  onValuesChangeFinish={(e)=>this.props.setWine({longueur:e[0]})}
                />

            </TouchableOpacity>

            <View style={{...styles.container,marginVertical:20}}>
              <Text style={{...styles.title,fontSize:26,color:"#6D6D6D"}}>{'Commentaires'}</Text>
            </View>
          <TouchableOpacity
            onPress={()=>this.refs.commentaire.focus()}
            style={{...styles.TouchableOpacity,flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center',paddingVertical:10,marginVertical:5,backgroundColor:'white'}}>

                <TextInput
                ref={'commentaire'}
                style={{flex:1,padding:10,marginBottom:30}}
                multiline
                value={commentaire}
                placeholder='Insérez vos notes'
                onChangeText={(commentaire)=>this.props.setWine({commentaire})}/>


          </TouchableOpacity>


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
    padding:6,
    marginVertical:5,backgroundColor:'white'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',


  },
  label:{
    color: "#454545",
    fontSize: 14,
    marginVertical:5,
    fontFamily:'ProximaNova-Semibold',
    flex:1

  },
  textInputLabel : {
    color:'#6D6D6D',
    fontFamily:'ProximaNova-Regular',
    // padding:10,

    // paddingBottom:8,
    fontSize:14,
    justifyContent:'center',
    alignSelf:'flex-end',
    alignItems:'center'
  },
  textInputPicker:{
    color:'#464646',
    fontFamily:'ProximaNova-Bold',
    textAlign:'right',
    flexWrap:'wrap',
    flexDirection:'row',
    width:100,
    fontSize:14,
    justifyContent:'center',
    alignSelf:'flex-end',
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
    fontSize: 13,
    alignSelf:'flex-start',
    textAlign: 'left',
    margin:5
  },
  domain: {
    fontSize: 20,
    color: "#454545",
    alignSelf:'flex-start',
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
  },
  appelation: {
    color: "#454545",
    fontSize: 19,
    fontFamily:"ProximaNova-Bold",
    alignSelf:'flex-start',
    textAlign: 'left',

    marginVertical: 3,
  },
  region: {
    color: "#454545",
    fontSize: 18,
    fontFamily:"ProximaNova-Regular",
    alignSelf:'flex-start',
    textAlign: 'left',
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

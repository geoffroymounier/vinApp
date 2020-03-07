import React, {Component} from 'react';
import {Animated,Dimensions,InteractionManager,Easing,StyleSheet, Text, View,Image,TouchableOpacity} from 'react-native';
import Checkbox from '../markers/checkbox';
const heartFull = require('../../assets/heart-full.png')
const glassWine = require('../../assets/glass-wine.png')
const bottle = require('../../assets/bottle.png')
import countryFlags from '../../assets/countries/index.js'
import {colors,cepageValues} from '../array/description'
const { height, width } = Dimensions.get('window');


export default class WineItem extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      width: new Animated.Value(0),
      opacityValue: new Animated.Value(0),
      opacityText: new Animated.Value(0),
      translateYValue: new Animated.Value(-0.1*height),
    };
  }
  componentWillMount(){
    this.start()
  }
  _onPress = () => {

    this.selectIt(1,()=>{
      this.selectIt(0,()=> void 0)
      this.props.activeSelection ? this.props.toggleSelect(this.props._id) : this.props.onPressItem(this.props.id)
      this.selectIt(0,()=> void 0)
    })
  };

  selectIt(value,callback){
    Animated.timing(this.state.width,{
      toValue: value,
      duration: 150,
      easing : Easing.linear
    }).start(()=>callback())
  }
  start(){
    Animated.parallel([
      Animated.timing(this.state.opacityValue, {
        toValue: 1, // Animate to final value of 1
        duration:150,
        useNativeDriver:true,
        delay:300
      }),
      Animated.timing(this.state.opacityText, {
        toValue: 1, // Animate to final value of 1
        duration:150,
        useNativeDriver:true,
        delay:0
      }),
      Animated.timing(this.state.translateYValue, {
        toValue: 0,
        duration:200,
        useNativeDriver:true,
        delay:300
      }),
    ]).start();
  }
  render() {
    const { opacityValue, translateYValue , opacityText } = this.state;
    const animatedStyle = {
      opacity: opacityValue,
      transform: [{ translateY: translateYValue }],
    };
    const animatedText = {
      opacity: opacityText
    };
    const width = this.state.width.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    })
    this.selectIt(0, ()=> void 0)
    let cepage = []
    this.props.cepage.map((c) => {
      cepage.push((cepageValues.values[c]))
    })
    let favorite = this.props.favorite
    let pastilles = this.props.pastilles || []
    let backgroundColor = (colors[this.props.color]||{}).color || '#e6e6e6'
    let backgroundTextColor = (colors[this.props.color]||{}).color == '#FFC401' ? "#262626" : 'white'

    return (

      <Animated.View  style={animatedStyle}>
      <TouchableOpacity
        style={{borderColor:"lightgray",borderBottomWidth:1,paddingVertical:5}}
        activeOpacity={1}
        onPressIn={()=>this.selectIt(1,()=> void 0)}
        onPress={this._onPress}
        >
        <Animated.View style={{position:'absolute',zIndex:10,backgroundColor: 'lightgray', opacity: 0.2, height:"100%", width: width }}/>
      <View style={{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:5}}>

        <View style={{flexDirection:'row',alignItems:'center',flex:6}}>
          <View >
            <Image
              resizeMode='contain'
              style={{
              tintColor: colors[this.props.color] ? colors[this.props.color].color : 'black',
              height:32
            }} source={glassWine} />

          </View>

          <View style={{paddingHorizontal:10,flex:1}}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.title}>{this.props.appelation}</Text>
              {favorite ?
                  <View>
                    <Image style={{
                      resizeMode: 'contain',
                      height:20
                    }} source={heartFull} />
                  </View>
              : void 0}
            </View>
            <View style={{flexDirection:'row'}}>

            <Image style={{
              resizeMode: 'center',
              height:18,
              width:18,
            }} source={countryFlags[this.props.country]} />
            <Text style={styles.domain}>{this.props.region || ''}</Text>
            </View>

            {this.props.annee ? <Text style={styles.domain}>{this.props.annee || ''}</Text> : void 0}
            {this.props.domain && this.props.domain != '' ? <Text style={styles.domain}>{this.props.domain} </Text> : void 0}
          </View>

          {this.props.activeSelection ?
            <Checkbox
             onPress={this._onPress}
             checked={this.props.selected}
            />
            :
            <View style={{alignItems:'flex-end',alignSelf:'flex-start'}}>
            <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'row'}}>
              <Text style={{fontSize:18,alignSelf:'flex-end',textAlign:'right'}}>{this.props.price ? this.props.price + '€':''}</Text>
            </View>

            <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'row'}}>
              <Text style={{alignSelf:'center',alignItems:'flex-end',fontSize:18,flexWrap: "wrap",textAlign:'right'}}>{this.props.stock}</Text>
              <View>
                <Image style={{
                  resizeMode: 'contain',
                  height:32,
                  width:20
                }} source={bottle} />
              </View>
            </View>
          </View>

          }

        </View>




        </View>
        <View style={{...styles.pastilleView,flexWrap:'wrap',justifyContent:'flex-start'}}>
            {pastilles.length > 0 &&
              pastilles.map((e,i) => (
              <View key={i} style={{backgroundColor:backgroundColor,flexDirection:'row',alignItems:'center',borderRadius:20,padding:3,margin:3}} >
                  <Text style={{color:backgroundTextColor,fontSize:14,padding:5}}>{e}</Text>
              </View>
            )
          )}
        </View>

      </TouchableOpacity>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  pastilleView : {
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',alignItems:'center',
    paddingHorizontal:6,
    backgroundColor:'white',
  },
  label:{
    alignSelf:'center',
    fontSize: 20,
    textAlign: 'left',
    marginRight:20,
  },

  chip:{
    margin:5,
  },
  title: {
    fontSize: 20,
    fontFamily:"ProximaNova-Regular",
    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  domain: {
    fontSize: 16,
    fontFamily:"ProximaNova-Regular",
    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  appelation: {
    color:"#262626",
    fontWeight:"800",
    fontSize: 24,
    alignSelf:'flex-start',
    textAlign: 'left',
    margin: 10,
  },
  undertitle: {
    fontSize: 16,
    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

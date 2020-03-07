import React, {Component} from 'react';
import {Animated,Dimensions,InteractionManager,Easing,StyleSheet, Text, View,Image,TouchableOpacity} from 'react-native';
import Checkbox from '../markers/checkbox';
const heartFull = require('../../assets/heart-full.png')
const glassWine = require('../../assets/glass-wine.png')
const bottle = require('../../assets/bottle.png')
import {colors,cepageValues} from '../array/description'
const { height, width } = Dimensions.get('window');



export default class CellarItem extends React.Component {
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
      // this.props.onPressItem(this.props.id)
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
    let favorite = this.props.favorite

    return (

      <Animated.View  style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={()=>this.selectIt(1,()=> void 0)}
        onPress={this._onPress}
        >
        <Animated.View style={{position:'absolute',zIndex:10,backgroundColor: 'lightgray', opacity: 0.2, height:"100%", width: width }}/>
        <View style={{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderColor:"lightgray",borderBottomWidth:1,padding:10}}>

        <View style={{flexDirection:'row',alignItems:'center',flex:6}}>


          <View style={{paddingHorizontal:10,alignSelf:'baseline',flex:1,flexDirection:'column'}}>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.title}>{this.props.name}</Text>
            </View>
            <Text style={styles.domain}>{this.props.description} </Text>
          </View>

        </View>
        {this.props.activeSelection ?
          <Checkbox
           onPress={this._onPress}
           checked={this.props.selected}
         />
        :
        void 0
        // <View style={{flex:1,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
        //   <Text style={{alignSelf:'center',flexWrap: "wrap",textAlign:'center'}}>{this.props.stock}</Text>
        //   <View>
        //     <Image style={{
        //       resizeMode: 'contain',
        //       height:32
        //     }} source={bottle} />
        //   </View>
        // </View>
        }

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
  label:{
    alignSelf:'center',
    fontSize: 20,
    textAlign: 'left',
    marginRight:20,
  },
  textInputPicker:{
    color:'#262626',
    padding:10,
    paddingBottom:8,
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
    fontSize: 20,
    fontFamily:"ProximaNova-Regular",
    color:"#434343",
    alignSelf:'flex-start',
    textAlign: 'left',
    marginHorizontal: 5,
    marginVertical:5
  },
  domain: {
    fontSize: 16,
    fontFamily:"ProximaNova-Regular",
    color:"#434343",
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

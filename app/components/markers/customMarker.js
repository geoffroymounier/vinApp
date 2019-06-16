
import React from 'react';
import { StyleSheet, Image,Text,View } from 'react-native';

class CustomMarker extends React.Component {
  render() {
    return (
      <View
        style={{...styles.image}}
      ><Text style={{fontSize:12,color : !this.props.active ? 'lightgray' : void 0}}>{this.props.currentValue}{this.props.suffix}</Text></View>

    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 36,
    width: 36,
    borderRadius:18,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "darkgray",
    shadowOpacity: 0.7,
    shadowRadius: 2,shadowOffset: {
    height: 1,
    width:1,
  }, backgroundColor:'#FEFDF8'

  },
});

export default CustomMarker;

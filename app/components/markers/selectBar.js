import React from 'react'
import {TouchableOpacity,View,Text,StyleSheet} from 'react-native'
import Checkbox from '../markers/checkbox';

export default class SelectBar extends React.Component {
  constructor(props){
    super(props)
  }
  _onPress = (e) => this.props.onPress()
  render(){
    return(
      <TouchableOpacity onPress={this.props._onPress} >
        <View style={styles.selectView}>
          <Text style={styles.selectTitle}>Tout Selectionner</Text>
          <Checkbox
           onPress={this.props.onPress}
           checked={this.props.allSelect}
         />
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  selectTitle: {
    paddingHorizontal:10,fontSize:18,flex:1
  },
  selectView: {
    flexDirection:'row',
    borderColor:"lightgray",
    borderBottomWidth:1,padding:10
  }
});

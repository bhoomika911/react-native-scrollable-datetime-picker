/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import DatePicker from "react-native-scrollable-datetime-picker"
type Props = {};
export default class App extends Component<Props> {
  onPressReset(){
    alert("Reset clicked");
  }

  onPressDone(startMillies,endMillies){
    // alert(startMillies)
    let result = "";
    if(startMillies){
      result += new Date(startMillies);
    }
    if(endMillies){
      result += ("\n to  \n" + new Date(endMillies));
    }
    alert(result);
  }

  onPressCancel(){
    alert("Cancel clicked");
  }

  render() {
    return (
      <View style={styles.container}>
        <DatePicker
          // isSingleDateSelection = {true} //For date range selection, make it false
          onPressReset ={()=>this.onPressReset()}
          onPressDone ={(startMillies,endMillies)=>this.onPressDone(startMillies,endMillies)}
          onPressCancel ={()=>this.onPressCancel()}
          // startDate= '20181212'
          // untilDate= '20181215'
          // selectedBackgroundColor = "red"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header : {
    width  :window.width,
    height : 50,
    backgroundColor : 'black',
    alignItems : 'center',
    justifyContent : 'center'
  },
  headerText : {
    color : 'white'
  }
});

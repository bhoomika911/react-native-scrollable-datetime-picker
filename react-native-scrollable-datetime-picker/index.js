import React, { Component } from "react";

import {
  Image,
  ImageBackground,
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  TextInput,
  SafeAreaView,
  Modal,
  Alert,
  StyleSheet
} from "react-native";
import Moment from "moment";
import DatepickerRange from './react-native-range-datepicker';

const window = Dimensions.get("window");
let self;

class DatePicker extends Component {
  constructor(props) {
    super(props);
    self = this;

    let timeList = [
      {
        timeText : "12:00",
        ampm : "AM",
        isSelected : false
      },
      {
        timeText : "12:15",
        ampm : "AM",
        isSelected : false
      },
      {
        timeText : "12:30",
        ampm : "AM",
        isSelected : false
      },
      {
        timeText : "12:45",
        ampm : "AM",
        isSelected : false
      }
    ];
    let tempHour = 0;
    let tempMin = 0;

    for(i = 1 ; i <=12 ; i++){
      tempHour = (i < 10 )? ("0" + i): i;
      for(j = 0 ; j < 60 ; j= j +15){
        tempMin = (j == 0 )? ("00"): j;
        ampm = (i == 12) ? "PM" : "AM";

        timeList.push({
          timeText : ("" + tempHour + ":" + tempMin),
          ampm : ampm,
          isSelected : false
        });
      }
    }

    for(i = 1 ; i <12 ; i++){
      tempHour = (i < 10 )? ("0" + i): i;
      for(j = 0 ; j < 60 ; j= j +15){
        tempMin = (j == 0 )? ("00"): j;

        timeList.push({
          timeText : ("" + tempHour + ":" + tempMin),
          ampm : "PM",
          isSelected : false
        });
      }
    }

    let yearList = [];
    for(j = 1990 ; j < 2030 ; j++){
      yearList.push(j);
    }


    this.state = {
      yearList : yearList,
      selectedYear : ((new Date()).getFullYear()),
      timeList : timeList,
      startDate: null,
      endDate: null,
      startTimeIndex : 0,
      endTimeIndex : 0,
    };
  }

  onPressDate(startDateSelected, endDateSelected){
    let {timeList,startDate,endDate,startTimeIndex,endTimeIndex} = self.state;
    if(startDateSelected !== null && endDateSelected == null){ //To reset data
      startTimeIndex =  0;
      endTimeIndex = 0;
    }

    self.setState({
      startDate : startDateSelected,
      endDate : endDateSelected,
      startTimeIndex :startTimeIndex,
      endTimeIndex : endTimeIndex
    });
  }

  onPressReset(){
    let {timeList,startDate,endDate,startTimeIndex,endTimeIndex} = self.state;
    startDate  = null;
    endDate  = null;
    startTimeIndex =  0;
    endTimeIndex = 0;

    self.setState({
      startDate : startDate,
      endDate : endDate,
      startTimeIndex :startTimeIndex,
      endTimeIndex : endTimeIndex
    });

    self.refs.myDateRangePickerOriginal.onReset();

    if(self.props.onPressReset){
      self.props.onPressReset();
    }
  }

  onPressDone(){
    let {timeList,startDate,endDate,startTimeIndex,endTimeIndex} = self.state;
    let {isSingleDateSelection} = this.props;

    if(isSingleDateSelection) {
      if(startDate == null){
        Alert.alert(
          "alert",
          "Please select date.",
          [{ text: "OK" }],
          { cancelable: false }
        );
        return false;
      }



      let splitStartTime = timeList[startTimeIndex].timeText.split(":");
      let startHour = ((timeList[startTimeIndex].ampm == "PM") && (parseInt(splitStartTime[0]) !== 12)) ? (12 + parseInt(splitStartTime[0])) : parseInt(splitStartTime[0]);
      let startMin = parseInt(splitStartTime[1]);
      let startMillies = startDate + (startHour * 60 * 60 * 1000) + (startMin * 60 * 1000);

      if(self.props.onPressDone){
        self.props.onPressDone(startMillies);
      }
    }else{
      if((startDate == null) || (endDate == null)){
        Alert.alert(
          "alert",
          "Please select date range.",
          [{ text: "OK" }],
          { cancelable: false }
        );
        return false;
      }

      let splitStartTime = timeList[startTimeIndex].timeText.split(":");
      let splitEndTime = timeList[endTimeIndex].timeText.split(":");
      let startHour = ((timeList[startTimeIndex].ampm == "PM") && (parseInt(splitStartTime[0]) !== 12)) ? (12 + parseInt(splitStartTime[0])) : parseInt(splitStartTime[0]);
      let endHour = ((timeList[endTimeIndex].ampm == "PM") && (parseInt(splitEndTime[0]) !== 12)) ? (12 + parseInt(splitEndTime[0])) : parseInt(splitEndTime[0]);
      let startMin = parseInt(splitStartTime[1]);
      let endMin = parseInt(splitEndTime[1]);
      let startMillies = startDate + (startHour * 60 * 60 * 1000) + (startMin * 60 * 1000);
      let endMillies = endDate + (endHour * 60 * 60 * 1000) + (endMin * 60 * 1000);

      if(self.props.onPressDone){
        self.props.onPressDone(startMillies,endMillies);
      }
    }




  }

  onPressTime(index){
    let {timeList,startDate,endDate,startTimeIndex,endTimeIndex} = self.state;
    // timeList.forEach(function(obj,indexItem){
    //   if(indexItem == index){
    //     obj.isSelected = true;
    //   }else{
    //     obj.isSelected = false;
    //   }
    // });
    if((startDate != null) && (endDate == null)){
      startTimeIndex = index;
    }else{
      endTimeIndex = index;
    }

    self.setState({
      timeList : timeList,
      startTimeIndex : startTimeIndex,
      endTimeIndex  : endTimeIndex
    });
  }

  onPressYear(index){
    let {yearList,selectedYear} = this.state;

    selectedYear = yearList[index];
    self.setState({
      selectedYear : selectedYear
    },function(){
      self.refs.myDatePicker.getMonthStack();
    });
  }

  componentWillMount(){
    let {isSingleDateSelection} = this.props;
    let {startDate , endDate} = this.state;

    if(isSingleDateSelection){
      if(startDate == null && this.props.startDate){
        startDate = new Date(Moment(this.props.startDate, "YYYYMMDD").format()).getTime();
      }
    }else{
      if(startDate == null && this.props.startDate && this.props.untilDate){
        startDate = new Date(Moment(this.props.startDate, "YYYYMMDD").format()).getTime();
        endDate = new Date(Moment(this.props.untilDate, "YYYYMMDD").format()).getTime();
      }
    }

    this.setState({
      startDate  :startDate,
      endDate : endDate
    })
  }

  componentDidMount(){
    let scrollX = 73 * ((new Date()).getFullYear() - 1989);
    setTimeout(function(){
      self.refs.myDatePicker.scrollTo({x:scrollX , y: 0, animated : true})
    });
  }

  onPressCancel(){
    if(self.props.onPressCancel){
      self.props.onPressCancel();
    }
  }

  render() {
    let {onPressCancel,isSingleDateSelection} = this.props;
    let {timeList,yearList,startDate,endDate,startTimeIndex,endTimeIndex,selectedYear} = this.state;
    let selIndexToShow = -1;

    if((startDate == null) && (endDate == null)){
      selIndexToShow = -1;
    }else if((startDate != null) && (endDate == null)){
      selIndexToShow = startTimeIndex;
    }else{
      selIndexToShow = endTimeIndex;
    }

    let startDateTime = (startDate == null) ?
                        "Date, Time"
                        :
                        (Moment(new Date(startDate)).format("DD MMM YYYY")  + (startTimeIndex >= 0 ? (", " + timeList[startTimeIndex].timeText + " " + timeList[startTimeIndex].ampm) : "" ));

   let endDateTime = (endDate == null) ?
                      "Date, Time"
                      :
                      (Moment(new Date(endDate)).format("DD MMM YYYY")  + (endTimeIndex >= 0 ? (", " + timeList[endTimeIndex].timeText + " " +  timeList[endTimeIndex].ampm) : "" ));

    let footerDoneDisableColor = ((startDate == null) || (endDate == null)) ? {backgroundColor : 'rgba(0,0,0,0.3)'} : {};

    let startDateTimeForDP = (startDate == null) ?
                        null
                        :
                        Moment(new Date(startDate)).format("YYYYMMDD");

   let endDateTimeForDP = (endDate == null) ?
                      null
                      :
                      Moment(new Date(endDate)).format("YYYYMMDD");

    return (
      <Modal
        animationType="fadeIn"
        transparent={true}
        visible={true}
        onRequestClose={() => self.onPressCancel()}
      >
        <SafeAreaView style={styles.mainContainer}>
          {
            isSingleDateSelection ?
            <View style={[styles.headerContainer,{alignItems : 'center',justifyContent : 'center'}]}>
              <View style = {styles.headerItemForSingle}>
                <View style= {styles.startDateViewForSingle}>
                   <Text style = {[styles.startTitle]}>Selected Date</Text>
                   <Text style = {[styles.startDate]}>{startDateTime}</Text>
                </View>
              </View>
            </View>
            :
            <View style={styles.headerContainer}>
              <View style = {styles.headerItem}>
                <View style= {styles.startDateView}>
                   <Text style = {[styles.startTitle]}>Start</Text>
                   <Text style = {[styles.startDate]}>{startDateTime}</Text>
                </View>
              </View>

              <View style = {styles.headerItem}>
                <View style= {styles.startDateView}>
                   <Text style = {[styles.startTitle]}>End</Text>
                   <Text style = {[styles.startDate]}>{endDateTime}</Text>
                </View>
              </View>
            </View>
          }

          <View style={styles.mainYearView}>
            <View style={styles.timePicker}>
              <ScrollView
              ref="myDatePicker"
              showsHorizontalScrollIndicator = {false}
              horizontal = {true}>
              {
                yearList.map(function(objYear,index){
                  let timeTextSel = (selectedYear == objYear) ? styles.timeTextSel : {};
                  return (
                    <TouchableHighlight
                      underlayColor = "transparent"
                      onPress={() => self.onPressYear(index)}>
                      <View style={styles.yearItemView}>
                        <Text style = {[styles.timeText,timeTextSel]}>{objYear}</Text>
                      </View>
                    </TouchableHighlight>
                  )
                })
              }
              </ScrollView>
            </View>
          </View>


          <View style={styles.body}>
            <DatepickerRange
                ref = "myDateRangePickerOriginal"
                isSingleDateSelection = {isSingleDateSelection}
                selectedBackgroundColor = {this.props.selectedBackgroundColor}
                initialMonth = {new Date(selectedYear,0,1)}
                startDate={startDateTimeForDP}
                untilDate= {endDateTimeForDP}
                showReset = {false}
              	showClose = {false}
                // onReset = {() => }
                onSelect= {( startDate, endDate ) => self.onPressDate(startDate, endDate)}
            />
          </View>

          <View style={styles.mainTimeView}>
            <View style={styles.timerTitleMain}>
              <View style={styles.timeTitleLine}/>
              <View style={styles.timeTitleMiddle}>
                <Text style = {[styles.timeTileTxt]}>Time</Text>
              </View>
              <View style={styles.timeTitleLine}/>
            </View>

            <View style={styles.timePicker}>
              <ScrollView showsHorizontalScrollIndicator = {false} horizontal = {true}>
              {
                timeList.map(function(objTime,index){
                  let timeTextSel = (selIndexToShow == index) ? styles.timeTextSel : {};
                  let ampmSel = (selIndexToShow == index) ? styles.ampmSel : {};

                  return (
                    <TouchableHighlight
                      underlayColor = "transparent"
                      onPress={() => self.onPressTime(index)}>
                      <View style={styles.timeItemView}>
                        <Text style = {[styles.timeText,timeTextSel]}>{objTime.timeText}</Text>
                        <Text style = {[styles.ampmText,ampmSel]}>{objTime.ampm}</Text>
                      </View>
                    </TouchableHighlight>
                  )
                })
              }
              </ScrollView>
            </View>
            {
              // <View style={styles.timeTitle} pointerEvents = "box-none">
              //   <Text style = {[styles.timeTileTxt]}>Time</Text>
              // </View>
            }


          </View>


          <View style={styles.footerContainer}>
            <TouchableHighlight
              underlayColor={"transparent"}
              onPress={() => self.onPressReset()}
              style={[
                styles.footerButtonsContainer,
              ]}
            >
              <Text style={[styles.footerText]}>
                Reset
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={"transparent"}
              onPress={() => self.onPressDone()}
              style={[
                styles.footerButtonsContainer,
              ]}
            >
              <Text style={[styles.footerText]}>
                Done
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={"transparent"}
              onPress={() => self.onPressCancel()}
              style={[
                styles.footerButtonsContainer,
              ]}
            >
              <Text style={[styles.footerText]}>
                Cancel
              </Text>
            </TouchableHighlight>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer : {
    flex : 1 ,
    backgroundColor : '#F7F7F7'
  },
  headerContainer : {
    flexDirection : 'row',
    paddingTop : 5,
    paddingBottom : 5,
    backgroundColor : 'rgba(255,255,255,1)',
    borderBottomColor : 'rgba(0,0,0,0.2)',
    borderBottomWidth : 1,
  },
  backIconContainer : {
    width : 50,
    alignItems : 'center',
    justifyContent : 'center'
  },
  backIconStyle : {
    fontSize : 30,
    color : 'rgba(0,0,0,0.8)'
  },
  mainTimeView : {
    borderColor : 'rgba(0,0,0,0.2)',
    // borderTopWidth  : 1,
    backgroundColor : 'white',
    marginBottom : 40
  },
  mainYearView : {
    borderColor : 'rgba(0,0,0,0.2)',
    // borderTopWidth  : 1,
    backgroundColor : 'white',
    borderBottomWidth  : 1,
  },
  yearItemView : {
    height :50,
    width : 80,
    alignItems : 'center',
    justifyContent : 'center'
  },
  timePicker : {
    margin : 0,
  },
  timeItemView : {
    height :70,
    width : 80,
    alignItems : 'center',
    justifyContent : 'center',
    paddingBottom  : 10
  },
  timeText : {
    fontSize : 16,
    color : 'rgba(0,0,0,0.3)'
  },
  ampmText : {
    fontSize : 12,
    color : 'rgba(0,0,0,0.3)'
  },
  timeTextSel : {
    fontSize : 22,
    color :'rgba(0,0,0,0.8)',
    fontWeight : 'bold'
  },
  ampmSel : {
    fontSize : 18,
    color : 'rgba(0,0,0,0.8)',
    fontWeight : 'bold'
  },
  timeTitle : {
    margin : 5,
    borderRadius : 5,
    borderColor : 'rgba(0,0,0,0.2)',
    backgroundColor : 'white',
    borderWidth  : 1,
    position : 'absolute',
    left : (window.width - 80)/2,
    top : 5,
    width  : 80,
    height : 20,
    alignItems : 'center',
    justifyContent : 'center'
  },

  body : {
    flex : 1,
  },
  footerContainer : {
    flexDirection : 'row',
    position : 'absolute',
    bottom : 0,
    left : 0,
    right :0,
    borderTopWidth : 1,
    borderTopColor : 'rgba(0,0,0,0.2)',
    backgroundColor : 'white'
  },
  footerButtonsContainer : {
    // width : window.width/ 2,
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center',
    padding : 15,
    marginHorizontal : 1,
    backgroundColor : 'rgba(0,0,0,0.1)'

  },
  footerText : {
    fontSize : 15,
    color: "#1c91e5"
  },
  headerItem : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
    paddingLeft : 10
  },
  headerItemForSingle : {
    flex : 1,
    // flexDirection : 'row',
    alignItems : 'center',
    paddingLeft : 10
  },
  nextIconBg : {
    margin : 10,
    height : 16,
    width : 16,
    borderRadius : 8,
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor : 'rgba(0,0,0,0.2)',
  },
  nexIconStyle : {
    color : 'white',
    fontSize : 12,
    alignItems : 'center',
    justifyContent : 'center',
  },
  startTitle : {
    fontSize : 12,
    color : 'rgba(0,0,0,0.3)',
    fontWeight : 'bold'
  },
  startDate : {
    fontSize : 12,
    color : 'rgba(0,0,0,0.8)',
    fontWeight : 'bold',
    marginTop : 3

  },
  timerTitleMain : {
    flexDirection : 'row',
    height :20,
    width : window.width,
    backgroundColor : 'white',
    alignItems : 'center'
  },
  timeTitleLine : {
    width : (window.width - 80)/2,
    height : 1,
    backgroundColor : 'rgba(0,0,0,0.3)'
  },
  timeTitleMiddle : {
    // margin : 5,
    borderRadius : 5,
    borderColor : 'rgba(0,0,0,0.2)',
    backgroundColor : 'white',
    borderWidth  : 1,
    width  : 80,
    height : 20,
    alignItems : 'center',
    justifyContent : 'center'
  },
  startDateViewForSingle : {
    alignItems : 'center'
  }
});


export default DatePicker;

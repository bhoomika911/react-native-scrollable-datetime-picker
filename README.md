# react-native-scrollable-datetime-picker

This is my first npm package, inspired by "react-native-range-datepicker".


![Sigle date selection demo](https://drive.google.com/uc?export=view&id=1HFzXE2SgHdFlswm2x_CCVOKzAJYbgtNA) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ![Date Range selecting demo](https://drive.google.com/uc?export=view&id=1oS9cEI7nnHM9cNxkKERvc5Bw6RzI7znh)

### Install
```sh
$ npm i react-native-scrollable-datetime-picker --save
```

### How to use
```jsx
import DatePicker from "react-native-scrollable-datetime-picker"

<DatePicker
  isSingleDateSelection = {true} //For date range selection,make it false
  onPressReset ={()=>this.onPressReset()}
  onPressDone ={(startMillies,endMillies)=>this.onPressDone(startMillies,endMillies)}
  onPressCancel ={()=>this.onPressCancel()}
  startDate= '20181212'
  untilDate= '20181215'
  selectedBackgroundColor = "red"
  hideTimePicker = {true}
/>

onPressReset(){
  alert("Reset clicked");
}

onPressDone(startMillies,endMillies){
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
```


### Proptypes
```jsx
static propTypes = {
	startDate: PropTypes.string,
	untilDate: PropTypes.string,
	onPressReset: PropTypes.func,
	onPressDone: PropTypes.func,
	onPressCancel: PropTypes.func,
	selectedBackgroundColor: PropTypes.string,
  isSingleDateSelection : PropTypes.boolean
  hideTimePicker : PropTypes.boolean
}
```

### Default props
```jsx
static defaultProps = {
  startDate: '',
	untilDate: '',
	onPressReset: () => {},
	onPressDone: () => {},
	onPressCancel: () => {},
	selectedBackgroundColor: '',
  isSingleDateSelection : false,
  hideTimePicker : false
};
```


Ok, that's all.

Sorry, if this README is so simple and miss something out.

Feel free to use this package and contributors are welcome.
Thank you.

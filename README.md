# react-native-scrollable-datetime-picker

This is my first npm package, inspired by "react-native-range-datepicker".

![react-native-scrollable-datetime-picker in action](https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png)

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
  isSingleDateSelection : false
};
```


Ok, that's all.

Sorry, if this README is so simple and miss something out.

Feel free to use this package and contributors are welcome.
Thank you.

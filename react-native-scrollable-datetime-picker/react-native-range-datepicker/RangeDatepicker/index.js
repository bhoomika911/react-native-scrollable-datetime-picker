'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  InteractionManager,
  Platform,
  ListView,
  StyleSheet,
  Button,
  Dimensions
} from 'react-native';
import Month from './Month';
// import styles from './styles';
import moment from 'moment';

const DEVICE_WIDTH = Dimensions.get('window').width;
let self;

export default class RangeDatepicker extends Component {
	constructor(props) {
		super(props);

    self = this;

		this.state = {
			startDate: props.startDate && moment(props.startDate, 'YYYYMMDD'),
			untilDate: props.untilDate && moment(props.untilDate, 'YYYYMMDD'),
			availableDates: props.availableDates || null
		}

		this.onSelectDate = this.onSelectDate.bind(this);
		this.onReset = this.onReset.bind(this);
		this.handleConfirmDate = this.handleConfirmDate.bind(this);
		this.handleRenderRow = this.handleRenderRow.bind(this);
	}

	static defaultProps = {
		initialMonth: '',
		dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		maxMonth: 12,
		buttonColor: 'green',
		buttonContainerStyle: {},
		showReset: true,
		showClose: true,
		ignoreMinDate: false,
		onClose: () => {},
		onSelect: () => {},
		onConfirm: () => {},
		placeHolderStart: 'Start Date',
		placeHolderUntil: 'Until Date',
		selectedBackgroundColor: '#23c38d',
		selectedTextColor: 'white',
		todayColor: '#23c38d',
		startDate: moment(),//'',
		untilDate: '',
		minDate: '',
		maxDate: '',
		infoText: '',
		infoStyle: {color: '#fff', fontSize: 13},
		infoContainerStyle: {marginRight: 20, paddingVertical: 5,
        backgroundColor:'',// '#23c38d',
         borderRadius: 20, alignSelf: 'flex-end'}
	};


	static propTypes = {
		initialMonth: PropTypes.string,
		dayHeadings: PropTypes.arrayOf(PropTypes.string),
		availableDates: PropTypes.arrayOf(PropTypes.string),
		maxMonth: PropTypes.number,
		buttonColor: PropTypes.string,
		buttonContainerStyle: PropTypes.object,
		startDate: PropTypes.string,
		untilDate: PropTypes.string,
		minDate: PropTypes.string,
		maxDate: PropTypes.string,
		showReset: PropTypes.bool,
		showClose: PropTypes.bool,
		ignoreMinDate: PropTypes.bool,
		onClose: PropTypes.func,
		onSelect: PropTypes.func,
		onConfirm: PropTypes.func,
		placeHolderStart: PropTypes.string,
		placeHolderUntil: PropTypes.string,
		selectedBackgroundColor: PropTypes.string,
		selectedTextColor: PropTypes.string,
		todayColor: PropTypes.string,
		infoText: PropTypes.string,
		infoStyle: PropTypes.object,
		infoContainerStyle: PropTypes.object
	}

	componentWillReceiveProps(nextProps) {
		this.setState({availableDates: nextProps.availableDates});
	}

	onSelectDate(date){
		let startDate = null;
		let untilDate = null;
		const { availableDates } = this.state;

    debugger;

		if(this.state.startDate && !this.state.untilDate)
		{
      if(this.props.isSingleDateSelection){
        startDate = date;
      }else if(date.format('YYYYMMDD') < this.state.startDate.format('YYYYMMDD') || this.isInvalidRange(date)){
				startDate = date;
			}
			else if(date.format('YYYYMMDD') > this.state.startDate.format('YYYYMMDD')){
				startDate = this.state.startDate;
				untilDate = date;
			}
			else{
				startDate = null;
				untilDate = null;
			}
		}
		else if(!this.isInvalidRange(date)) {
			startDate = date;
		}
		else {
			startDate = null;
			untilDate = null;
		}

		this.setState({startDate, untilDate});
		this.props.onSelect(startDate, untilDate);
	}

	isInvalidRange(date) {
		const { startDate, untilDate, availableDates } = this.state;

		if(availableDates && availableDates.length > 0){
			//select endDate condition
			if(startDate && !untilDate) {
				for(let i = startDate.format('YYYYMMDD'); i <= date.format('YYYYMMDD'); i = moment(i, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD')){
					if(availableDates.indexOf(i) == -1 && startDate.format('YYYYMMDD') != i)
						return true;
				}
			}
			//select startDate condition
			else if(availableDates.indexOf(date.format('YYYYMMDD')) == -1)
				return true;
		}

		return false;
	}

	getMonthStack(){
		let res = [];
		const { maxMonth, initialMonth } = this.props;
		let initMonth = moment();
		if(initialMonth && initialMonth != '')
			initMonth = moment(initialMonth, 'YYYYMM');

		for(let i = 0; i < maxMonth; i++){
			res.push(initMonth.clone().add(i, 'month').format('YYYYMM'));
		}

    console.log("res====>",res);

		return res;
	}

	onReset(){
		this.setState({
			startDate: null,
			untilDate: null,
		});

		this.props.onSelect(null, null);
	}

	handleConfirmDate(){
		this.props.onConfirm && this.props.onConfirm(this.state.startDate,this.state.untilDate);
	}

	handleRenderRow(month) {
		const { selectedBackgroundColor, selectedTextColor, todayColor, ignoreMinDate, minDate, maxDate } = this.props;
		let { availableDates, startDate, untilDate } = this.state;



		if(availableDates && availableDates.length > 0){
			availableDates = availableDates.filter(function(d){
				if(d.indexOf(month) >= 0)
					return true;
			});
		}

		return (
			<Month
				onSelectDate={this.onSelectDate}
        dayHeadings = {this.props.dayHeadings}
				startDate={startDate}
				untilDate={untilDate}
				availableDates={availableDates}
				minDate={minDate ? moment(minDate, 'YYYYMMDD') : minDate}
				maxDate={maxDate ? moment(maxDate, 'YYYYMMDD') : maxDate}
				ignoreMinDate={ignoreMinDate}
				dayProps={{selectedBackgroundColor, selectedTextColor, todayColor}}
				month={month} />
		)
	}

  componentDidMount(){
    let currentMonth = (new Date()).getMonth();
    let scrollY = 328 * currentMonth;

    setTimeout(function(){
      self.refs.datePickerListview.scrollTo({x:0 , y: scrollY, animated : true})
    })
  }

	render(){
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2});
		let monthStack = this.ds.cloneWithRows(this.getMonthStack());
			return (
				<View style={{backgroundColor: '#fff', zIndex: 1000, alignSelf: 'center'}}>
					{
						this.props.infoText != "" &&
						<View style={this.props.infoContainerStyle}>
							<Text style={this.props.infoStyle}>{this.props.infoText}</Text>
						</View>
					}
					<ListView
                  ref = "datePickerListview"
			            dataSource={monthStack}
			            renderRow={this.handleRenderRow}
			            // initialListSize={1}
			            showsVerticalScrollIndicator={false} />
				</View>
			)
	}
}

const styles = StyleSheet.create({
	dayHeader : {
		flexDirection: 'row',
		borderBottomWidth: 1,
		// paddingBottom: 5,
		// paddingTop: 5,
	},
	buttonWrapper : {
		paddingVertical: 10,
		paddingHorizontal: 15,
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderColor: '#ccc',
		alignItems: 'stretch'
	},
});

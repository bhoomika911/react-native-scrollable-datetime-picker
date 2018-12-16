'use strict'
import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Text,
	Dimensions
} from 'react-native';
import DayRow from './DayRow'
import moment from 'moment'

export default class Month extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.minDate != this.props.minDate)
			return true;

		if(nextProps.maxDate != this.props.maxDate)
			return true;

		if(nextProps.availableDates != this.props.availableDates)
			return true;

		if(nextProps.startDate && nextProps.startDate.format("YYYYMM") == nextProps.month)
			return true;

		if(nextProps.untilDate && nextProps.untilDate.format("YYYYMM") == nextProps.month)
			return true;

		if(this.props.startDate && this.props.startDate.format("YYYYMM") == nextProps.month)
			return true;

		if(this.props.untilDate && this.props.untilDate.format("YYYYMM") == nextProps.month)
			return true;

		if(nextProps.startDate && nextProps.untilDate && nextProps.startDate.format("YYYYMM") < nextProps.month && nextProps.untilDate.format("YYYYMM") > nextProps.month)
			return true;

		if(this.props.untilDate && this.props.startDate && this.props.startDate.format("YYYYMM") < nextProps.month && this.props.untilDate.format("YYYYMM") > nextProps.month)
			return true;

		if(nextProps.month != this.props.month)
			return true;

		return false;
	}


	getDayStack(month){
		let res = [];
		let currMonth = moment(month).month(); //get this month
		let currDate = moment(month).startOf("month"); //get first day in this month

		let dayColumn = [];
		let dayRow = [];
		let dayObject = {};
		let {startDate, untilDate, availableDates, minDate, maxDate, ignoreMinDate} = this.props;

		do{
			dayColumn = [];
			for(let i = 0; i < 7; i++){
				dayObject = {
					type : null,
					date: null
				};
			if(i == currDate.days() &&
						currDate.month() == currMonth )
				{
					if(minDate && minDate.format("YYYYMMDD") && currDate.format("YYYYMMDD") < minDate.format("YYYYMMDD")){
						if(startDate && startDate.format('YYYYMMDD') > currDate.format("YYYYMMDD") && currDate.format("YYYYMMDD") > moment().format("YYYYMMDD") && ignoreMinDate){}
						else{
							dayObject.type = 'disabled';
						}
					}
					if(maxDate && maxDate.format("YYYYMMDD") && currDate.format("YYYYMMDD") > maxDate.format("YYYYMMDD")){
						dayObject.type = 'disabled';
					}
					if(availableDates && availableDates.indexOf(currDate.format("YYYYMMDD")) == -1){
						dayObject.type = 'blockout';
					}
					if(startDate && startDate.format('YYYYMMDD') == currDate.format('YYYYMMDD')){
						if(!untilDate)
							dayObject.type = 'single';
						else{
							dayObject.type = 'first';
						}
					}
					if(untilDate && untilDate.format('YYYYMMDD') == currDate.format('YYYYMMDD')){
						dayObject.type = 'last';
					}
					if((startDate && startDate.format('YYYYMMDD') < currDate.format('YYYYMMDD')) &&
						(untilDate && untilDate.format('YYYYMMDD') > currDate.format('YYYYMMDD')))
						dayObject.type = 'between';

					dayObject.date = currDate.clone().format('YYYYMMDD');
					dayColumn.push(dayObject);
					currDate.add(1, 'day');
				}
				else{
					if(startDate && untilDate &&
						(
							startDate.format('YYYYMMDD') < currDate.format('YYYYMMDD')  &&
							untilDate.format('YYYYMMDD') >= currDate.format('YYYYMMDD')
						)
					){
						dayObject.type = 'between';
					}

					dayColumn.push(dayObject);
				}
			}

			dayRow.push(dayColumn);
		} while (currDate.month() == currMonth);

		return dayRow;
	}

	render() {
		const { month, dayProps } = this.props;
		const dayStack = this.getDayStack(moment(month, 'YYYYMM'));
		const DEVICE_WIDTH = Dimensions.get('window').width;
		const dayHeader = {
			flexDirection: 'row',
			// borderBottomWidth: 1,
			paddingBottom: 10,
			paddingTop: 10,
		};
		return (
			<View style={{alignItems : 'center'}}>
				<Text style={{padding: 5,fontWeight  :'500',}}>{moment(month, 'YYYYMM').format("MMMM YYYY")}</Text>
				<View style={dayHeader}>
					{
						this.props.dayHeadings.map((day, i) => {
							return (<Text style={{fontSize: 10,width: DEVICE_WIDTH / 7, textAlign: 'center'}} key={i}>{day}</Text>)
						})
					}
				</View>
				<View style={{fontSize: 12, padding: 10, borderTopWidth  :1,borderColor : 'rgba(0,0,0,0.3)'}}>
					{
						dayStack.map((days, i) => {
							return (
								<DayRow days={days} dayProps={dayProps} key={i} onSelectDate={this.props.onSelectDate}/>
							)
						})
					}
				</View>
			</View>
		);
	}
}

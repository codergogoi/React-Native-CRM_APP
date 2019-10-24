import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';

import { EMP_ID } from '../../store/actions/AppConst';

import { Container, Header, Title, Content, Left, Right, Body , Form, Item,Label, Input, Textarea } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, Alert, Platform } from 'react-native';
import MenuIcon from '../../images/back_arrow.png';


class ReportDetails extends Component {

	constructor(props) {
		super(props);
		 
	}

	onTapMenuButton = () => {
		this.props.navigation.goBack();
	}
  

	taskStatusView = (status) => {

		switch(status){
			case 0: // waiting for Accept
				return (
					<View style={[styles.genericStatus, {backgroundColor: '#FF1831'}]}>
							<Text style={styles.statusText}> Waiting to Accept! </Text>
					</View>
				);
			case 1: // accepted
				return (
					<View style={[styles.genericStatus, {backgroundColor: '#FF1831'}]}>
							<Text style={styles.statusText}> Waiting to Start </Text>
					</View>
				);
			case 2: // started
				return (
					<View style={[styles.genericStatus, {backgroundColor: '#F09564'}]}>
						<Text style={styles.statusText}> Work in Progress </Text>
					</View>
				);
			case 3: // completed
				return (
					<View style={[styles.genericStatus, {backgroundColor: '#1DAF1B'}]}>
						<Text style={styles.statusText}> Completed </Text>
					</View>
				);
			case 4: // ignored / Aborted
				return (
					<View style={[styles.genericStatus, {backgroundColor: '#A90505'}]}>
						<Text style={styles.statusText}> Ignored / Aborted </Text>
					</View>
				);
		}
 
	 
	}

	  
	render() {

		const { navigation } = this.props;

		const report  = navigation.getParam('report');
 
		return (
			<SafeAreaView style={styles.container}>
				<Container>
				<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
						<Left>
							<TouchableOpacity onPress={this.onTapMenuButton}>
								<Image source={MenuIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Left>
						<Body style={styles.taskHeader}>
							<Title>Report Details</Title>
						</Body>
						<Right />
					</Header>
					<Content>
						<View style={{ width: '100%' ,justifyContent: 'center', alignContent:'center', alignItems: 'center', paddingTop: 10}}>
							{this.taskStatusView(report.status)}
						</View>

						<View style={styles.itemStyle}>
							<Text style={styles.taskPlaceHolder}> Report Title</Text>
							<Text style={styles.taskText}>{report.title}</Text>
						</View>
						

						<View style={styles.itemStyle}>
							<Text style={styles.taskPlaceHolder}> Completion date</Text>
							<Text style={styles.taskText}>{report.date}</Text>
						</View>

						<View style={styles.itemStyle}>
							<Text style={styles.taskPlaceHolder}> Status</Text>
							<Text style={styles.taskText}>{report.status}</Text>
						</View>

						<View style={styles.itemStyle}>
							<Text style={styles.taskPlaceHolder}> Priority</Text>
							<Text style={styles.taskText}>{report.priority}</Text>
						</View>

						<View style={styles.itemStyle}>
							<Text style={styles.taskPlaceHolder}> Region</Text>
							<Text style={styles.taskText}>{report.region}</Text>
						</View>
						<View style={styles.itemStyle}>
							<Text style={styles.taskPlaceHolder}> Completion Expenses</Text>
							<Text style={styles.taskText}>{report.currency+' '+report.expenses}</Text>
						</View>

						<View style={styles.itemStyle}>
							<Text style={styles.taskPlaceHolder}> Payment Status</Text>
							<Text style={styles.taskText}>{report.payment_status}</Text>
						</View>
						
					</Content>
					 
				</Container>
			</SafeAreaView>
		);
	}
}

export default ReportDetails;

const styles = StyleSheet.create({
    
	container: {
		marginTop: Platform.OS === 'ios' ? 0 : 23,
		flex: 1,
		backgroundColor: '#fcfcfc'
	},
	header:{
		backgroundColor: '#212654',
		flex: 1,
		flexDirection: 'row',
	},
	menuIcon: {
		width: 40,
		height: 40
	},
	uploadImage: {
		width: 60,
		height: 60
	},
	title: {
		fontSize: 16,
		alignItems: 'center',
	},
	taskPlaceHolder:{
		width: '98%',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft:15,
		fontSize: 16,
		color: '#BEBFC3',
		backgroundColor: '#f9f9f9',
	
		marginBottom: 5,
	},
	taskText:{
		fontSize: 18,
		color: '#242427',
		marginBottom: 5,
		paddingLeft: 20,
	},
	commentText:{
		fontSize: 18,
		color: '#242427',
		marginBottom: 5,
		paddingLeft: 20,
		width: '100%'
	},
	itemStyle:{
		minHeight: 50,
		flexDirection:'column',
		alignItems: 'flex-start',
		margin: 5,
		marginBottom: 10,
		justifyContent: 'space-around',

	},
	taskHeader: {
		fontSize: 16,
		color: '#BEBFC3',
		alignItems: 'center'
	}, butonIcon:{
		width: 50,
		height: 50,
	},
	butonView: {
		width: 120,
		height: 42,
		backgroundColor: '#EEEEEE',
		borderRadius: 20,
		borderColor: '#D7D6D8',
		borderWidth: 1,
		margin: 10,
		flexDirection: 'row',
	}
	, buttonText: {
		color: 'black',
		alignContent: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		marginLeft: 5,
		marginTop: 8,

	},
	statusText:{
		color: '#FFFF',
		fontSize: 20,
	}
	,
	genericStatus: {
		backgroundColor: '#46B335',
		borderRadius: 21,
		width: 300,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center'
	},
	 
});

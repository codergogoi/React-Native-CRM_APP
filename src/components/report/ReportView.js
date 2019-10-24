import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { EMP_ID } from '../../store/actions/AppConst';

import { connect } from 'react-redux';

import { Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, ScrollView , Platform } from 'react-native';
import MenuIcon from '../../images/menu_icon.png';
import AddTaskIcon from '../../images/add_task.png';
import ReportList from './ReportList';
import { GetReports } from '../../store/actions/ReportActions';

class ReportView extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			 emp_id: ''
		};
	}

	componentDidMount(){
		this._subscribe = this.props.navigation.addListener('didFocus', () => {
			this.props.GetReports({emp_id: EMP_ID()});
		});
	}
 
	onTapMenuButton = () => {
		this.props.navigation.openDrawer();
	}

	onViewReportDetails = (report) => {
		this.props.navigation.navigate('ReportDetails', {report: report})
	}

	render() {

		const { reports} = this.props;

		return (
			<SafeAreaView style={styles.container}>
				<Container>
				<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
						<Left>
							<TouchableOpacity onPress={this.onTapMenuButton}>
								<Image source={MenuIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Left>
						<Body>
							<Title>Reports</Title>
						</Body>
						<Right />
					</Header>
					<Content bounce={true} >
							<View style={styles.assignedTaskList}>
									{reports !== undefined && <ReportList reports={reports} onViewReportDetails={this.onViewReportDetails} /> }
							</View>
					</Content>
				</Container>
			</SafeAreaView>
		);
	}
}


const mapStateToProps = (state) => ({
	reports: state.reportsReducer.reports
});
 
export default connect(mapStateToProps, {GetReports})(ReportView);
 
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
	title: {
		fontSize: 16,
		alignItems: 'center',
	},
	assignedTaskList: {
		backgroundColor: '#f9f9f9',
		borderColor: '#e0e1e2',
		borderTopWidth: 1
		
	},
	assignedTask: {
		height: 40,
		backgroundColor: '#f9f9f9',
		alignItems: 'center',
		
	},
	assignTitle:{
		fontSize: 20,
		color: '#4B5154',
		padding: 10,
	},
	activityTitle:{
		fontSize: 14,
		color: '#4B5154'
	}
	 
});


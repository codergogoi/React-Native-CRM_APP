import React, {Component } from 'react';
import { SafeAreaView, StyleSheet, Platform, TouchableOpacity, Image, Text, BackHandler, Alert } from 'react-native'; 
import { connect } from 'react-redux';
import { Container, Header, View, Title, Content, Left, Right, Body , Form, Item,Label, Input, Textarea } from 'native-base';
import MenuIcon from '../../images/menu_icon.png';
import AttendanceIcon from '../../images/attendance.png';

import { EMP_ID } from '../../store/actions/AppConst';
import { ViewAttendance, CheckStatus, CaptureAttendance, DismissAlert } from '../../store/actions/UserActions';
import AttendanceTableView from './AttendanceTableView';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class AttendencaeView extends Component {

    static navigationOptions = {
		drawerLabel: 'My Home',
		drawerIcon: ({ tintColor }) => (
		  <Image
			source={HomeIcon}
			style={[styles.icon, {tintColor: tintColor}]}
		  />
		),
		
	};

	constructor(props) {
		super(props);
		this.state = {
			pendingTask: 0,
			completedTask: 0,
			emp_id: '',
			filterIndex: 2,
			location: ''
		};

		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}


	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}

	componentDidMount(){

		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			});
		} else {
			this._getLocationAsync();
		}

		this._subscribe = this.props.navigation.addListener('didFocus', () => {
			
			let emp_id = EMP_ID();

			this.props.CheckStatus({ emp_id });
			this.props.ViewAttendance({ emp_id });
		});

		
	}



	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
		  this.setState({
			errorMessage: 'Permission to access location was denied',
		  });
		}
	
		let location = await Location.getCurrentPositionAsync({});
		  this.setState({ location: location });
	  };
  

 
    componentWillReceiveProps(nextProps) {
		 
    }

	onTapLogout = () => {
		alert('working Logout');
	}

	onTapMenuButton = () => {
		this.props.navigation.openDrawer();
	}


	onTapCaptureAttendance = () => {

		if (this.state.location === null) {
			Alert.alert(
				'Complete Task!',
				'Please turn on the Location Services and try again',
				[
					{text: 'OK', onPress: () => {
						this.props.DismissAlert('')
						this.props.navigation.goBack();
					}}
				],
				{cancelable: false},
			);
		}
		
		const { latitude,longitude} = this.state.location.coords;
 
		let emp_id = EMP_ID();
		let lat = latitude;
		let lng = longitude;
		this.props.CaptureAttendance({emp_id,lat, lng });
	}


	onTapInProgress = () => {
		this.setState({ filterIndex: 2});
	}

	onTapPending = () => {
		this.setState({ filterIndex: 1});
	}

	onTapCompleted  = () => {
		this.setState({ filterIndex: 3});
	}

	onViewTaskDetails = (task) => {

		if(task.grouped === true){
			this.props.navigation.navigate('GroupReview', {task: task})
		}else{
			this.props.navigation.navigate('TaskReview', {task: task})
		}
	}

	currentTask = (index) => {

		const {tasks } = this.props;

		if(tasks !== undefined){
			if(index === 3){
				return tasks.filter(function(item){
					return item.status === 3 
				})
			}else if (index === 2){
				return tasks.filter(function(item){
					return item.status === 2 
				})
			}else{
				return tasks.filter(function(item){
					return item.status < 2 || item.state === 4
				})
			}
 
		}else{
			return undefined;
		}
		
	}


	render() {


		const { attendance, login_status, marked_attendance } = this.props;

		 
		if(marked_attendance === true){
			Alert.alert(
				'Attendance!',
				'Attendance Captured Successfully!',
				[
				  {text: 'OK', onPress: () => {
						this.props.DismissAlert('')
					}
				},
				],
				{cancelable: false},
			  );
		}

 
		return (
			<SafeAreaView style={ styles.container }>
				<Container style={{backgroundColor: '#C8C8C8'}}>
					<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
						<Left>
							<TouchableOpacity onPress={this.onTapMenuButton}>
								<Image source={MenuIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Left>
						<Body>
							<Text style={styles.activityTitle}>Progress Activity</Text>
						</Body>
						<Right />
					</Header>
					
					<View style={styles.chartContainer}>
						<View style={{ flex: 1, height: 120, justifyContent: 'space-around', alignItems: 'center'}}>
							{login_status !== "Duplicate Check In Not Allowed!" && <TouchableOpacity onPress={this.onTapCaptureAttendance}>
									<Image source={AttendanceIcon} style={styles.attendanceIcon} />
							</TouchableOpacity>}
							<Text style={{ textAlign: 'center', fontSize: 14, color: '#5D6D7E', marginTop: 5}}>{login_status}</Text>
						</View>
						 
					</View>

					<Content bounce={true} >
						 		
							<View style={styles.assignedTaskList}>
								
								{attendance !== undefined && 
									<AttendanceTableView attendance={attendance} />
								}
								
							</View>
					</Content>
				</Container>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	attendance: state.userReducer.attendance,
	login_status: state.userReducer.login_status,
	marked_attendance: state.userReducer.marked_attendance
});

export default connect(mapStateToProps, { ViewAttendance, CheckStatus, CaptureAttendance, DismissAlert })(AttendencaeView)


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
	attendanceIcon: {
		width: 80,
		height: 80
	},
	title: {
		fontSize: 16,
		alignItems: 'center',
	},
	assignedTaskList: {
		backgroundColor: '#C8C8C8',
	
		
	},
	assignedTask: {
		minHeight: 40,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	sortView:{
		height: 40,
		width: '100%',
		paddingLeft: 20,
		paddingRight: 20,
		justifyContent:'space-around',
		flexDirection:'row',
		alignContent: 'stretch'

	},
	sortButtons:{
		backgroundColor: '#566492',
		height: 40,
		width: '33%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10

	},
	taskSortText:{
		color: '#FFF',
		fontSize: 16,
	},
	assignTitle:{
		fontSize: 20,
		color: '#4B5154',
		padding: 10,
		marginBottom: 10
	},
	activityTitle:{
		fontSize: 14,
		color: '#4B5154'
	},
	icon: {
		width: 24,
		height: 24,
	  },
	  chartContainer: {
		width: '100%',
		height: 130,
		  display: 'flex',
		  flexDirection: 'row',
		  backgroundColor: '#FFF',
			justifyContent: 'center',
			alignItems: 'center',
			alignContent: 'center',
		  
		  marginBottom: 10,
	  },
	  pieView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		width: '60%',
	},
	dataView: {
		flexDirection: 'column',
		justifyContent: 'space-around',
		width: '35%',
		padding: '2.5%',
	},
	legendView: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 10
	},
	legendText: {
		color: '#FFFF',
		fontSize: 12
	},
	checkInButton:{
		width: 200,
		height: 50,
		borderRadius: 30,
	},
	checkOutButton:{
		width: 200,
		height: 50,
		borderRadius: 30,
	}
});
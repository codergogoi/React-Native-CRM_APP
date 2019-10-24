import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { EMP_ID, PRINT } from '../../store/actions/AppConst';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { connect } from 'react-redux';

import { Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, ScrollView, Platform, Alert } from 'react-native';
import MenuIcon from '../../images/back_arrow.png';
import AddTaskIcon from '../../images/add_task.png';
import TaskToDoIcon from '../../images/task_to_do.png';
import GroupTaskList from '../task/GroupTaskList';
import { GetGroupTaskClients, UpdateTaskStatus, DismissAlert, CompleteTask, ResetImageURI } from '../../store/actions/TaskActions';
import { BackHandler } from 'react-native';
import moment from 'moment';


class GroupTask extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			remarks: 'N/A',
			 image: null,
			 uploadImage: null,
			 isUploading: false,
			 isCompleted: false,
			 location: null,
			 errorMessage: null,
			 emp_id: '',
			 filterIndex: 2
		};
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}
	
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}
	

	async componentDidMount() {
		this.getPermissionAsync();

		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			});
		} else {
			this._getLocationAsync();
		}

	}

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
		  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		  if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to upload proof of Task!');
		  }
		}
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
	

	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}
	componentDidMount(){

        const task  = this.props.navigation.getParam('task');

		this._subscribe = this.props.navigation.addListener('didFocus', () => {
			this.props.ResetImageURI();
			this.props.GetGroupTaskClients({group_id: task.group_id});

		});
	}
 
	onTapMenuButton = () => {
		this.props.navigation.goBack();
	}

	onViewTaskDetails = (task) => {
		this.props.navigation.navigate('GroupTaskDetails', {task: task})
	}

	onPickTask = (task) => {
		this.props.navigation.navigate('AddTask')
	}

	onTapInProgress = () => {
		this.setState({ filterIndex: 2});
	}

	onTapPending = () => {
		this.setState({ filterIndex: 1});
	}

	onTapCompleted  = (task) => {
		
		Alert.alert(
			'Confirm Finish Task!',
			'Are you sure to finish this task?',
			[
			  {text: 'Yes', onPress: () => {
				  this.onConfirmCompleteTask(task);
			  }},
			  {text: 'No', onPress: () => {}},
			],
			{cancelable: false},
		  );
	}
 


	onConfirmCompleteTask = (task) =>{

		const emp_id = EMP_ID();
		const task_id = task.id;
		const { remarks } = this.state;
		

		if(this.location === undefined){

			this.props.CompleteTask({ emp_id, task_id, remarks,latitude: 0, longitude: 0, update: false });

		}else{

			const { latitude,longitude} = this.state.location.coords;

			const { lat, lng, client_id } = task;
			
			if(lat === 0 && lng === 0){

				Alert.alert(
					'Complete Task!',
					"Client location is need to update to improve Navigation Service!",
					[
					{text: 'Finish Task', onPress: () => {
							this.props.CompleteTask({ emp_id, task_id, remarks,latitude, longitude, update: true, client_id });
						}
					},
					
					],
					{cancelable: false},
				);

			}else{
				this.props.CompleteTask({ emp_id, task_id, remarks,latitude, longitude, update: false });
			}
		}

	}

	onStartTask = (task) => {
		const emp_id = EMP_ID();
		const task_id = task.id;
		const status = 2;
		this.props.UpdateTaskStatus({ emp_id, task_id, status});
 	
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

	taskDetailsForGroup = (task) => {

		return (
			<View style={styles.taskHeader}>
				<View style={styles.taskTitleSticker}>
					<Text style={styles.dateText}>Task to Accomplish</Text>
				</View>
				<View style={{display: 'flex', flexDirection: 'row'}}> 
					<Image source={TaskToDoIcon} style={styles.taskToDoIcon} />
					<Text style={styles.taskTitle}>{task.title}</Text>
				</View>
				<Text style={styles.taskDescription}>{task.description}</Text>
				<View style={styles.dateView}>
					<Text style={styles.dateText}>{task.start_date} to {task.end_date}</Text>
				</View>
			</View>
		);

	}

	  
	render() {

		const { filterIndex} = this.state;
		const { group_task_clients, navigation,  isFinished, isUpdated } = this.props;

		const task  = navigation.getParam('task');

		PRINT(`isfinished ${ JSON.stringify(isFinished)}`);

		if(isFinished === true){
			Alert.alert(
				'Task Completed!',
				'Successfully completed selected Task!',
				[
				  {text: 'OK', onPress: () => {
						this.props.DismissAlert('')
						this.props.GetGroupTaskClients({group_id: task.group_id});

					}
				},
				],
				{cancelable: false},
			  );
		}else if(isUpdated === true){
			Alert.alert(
				'Task Status has Changed!',
				'Successfully Changed Task Status!',
				[
				  {text: 'OK', onPress: () => {
						this.props.DismissAlert('')
						this.props.GetGroupTaskClients({group_id: task.group_id});
					}
				},
				],
				{cancelable: false},
			  );
		}


		return (
			<SafeAreaView style={styles.container}>
				<Container style={{backgroundColor: '#C8C8C8'}}>
				<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
						<Left>
							<TouchableOpacity onPress={this.onTapMenuButton}>
								<Image source={MenuIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Left>
						<Body>
							<Title style={styles.title}>Group Task List</Title>
						</Body>
						<Right>
							 
						</Right>
					</Header>
                    
					
					<View>
                        {this.taskDetailsForGroup(task)}
                    </View>
					
					
					<Content bounce={true} >
							<View style={styles.assignedTaskList}>
								<GroupTaskList group_task_clents={group_task_clients} 
								onViewTaskDetails={this.onViewTaskDetails}
								onStartTask={this.onStartTask}
								onCompleteTask={this.onTapCompleted} />
							</View>
					</Content>
				</Container>
			</SafeAreaView>
		);
	}
}


const mapStateToProps = (state) => ({
	group_task_clients: state.taskReducer.group_task_clients,
	isFinished: state.taskReducer.isFinished,
	isUpdated: state.taskReducer.isUpdated
});
 
export default connect(mapStateToProps, {GetGroupTaskClients, UpdateTaskStatus, DismissAlert, CompleteTask, ResetImageURI})(GroupTask);
 
const styles = StyleSheet.create({
    
	container: {
		marginTop: Platform.OS === 'ios' ? 0 : 23,
		flex: 1,
		backgroundColor: '#fcfcfc'
	},
	header:{
		backgroundColor: '#F3F3F3',
		flex: 1,
		flexDirection: 'row',
	},
	menuIcon: {
		width: 40,
		height: 40
	},

	taskToDoIcon: {
		width: 42,
		height: 42,
		margin: 5,
	},
	taskHeader:{
		display: 'flex',
		flexDirection: 'column',
		height: 300,
		backgroundColor: '#F3F3F3',
	},
	taskTitle:{
		fontSize: 22,
		textAlign: 'justify',
		fontWeight: "400",
		color: '#292929',
		width: 300,
		marginBottom: 5,
	},
	taskDescription:{
		fontSize: 18,
		textAlign: 'justify',
		color: '#6D6D6D',
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20

	},

	title: {
		fontSize: 16,
		color: '#000',
		alignItems: 'center',
	},
	assignedTaskList: {
		backgroundColor: '#C8C8C8',
		borderColor: '#e0e1e2',
		
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
	},
	assignedTask: {
		marginTop: 5,
		minHeight: 50,
		backgroundColor: '#f9f9f9',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	sortView:{
		backgroundColor: '#FFFF',
		height: 40,
		width: '100%',
		paddingLeft: 20,
		paddingRight: 20,
		justifyContent:'space-around',
		flexDirection:'row',
		alignContent: 'stretch'

	},
	sortButtons:{
		backgroundColor: '#900C3F',
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
	taskPlaceHolder:{
		width: '98%',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft:15,
		fontSize: 16,
		color: '#8B888E',
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

	taskTitleSticker: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#79819c',
		borderRadius: 5,
		alignContent: 'center',
		alignItems: 'flex-start',
		justifyContent: 'center',
		width: 170,
		marginTop: 10,
		paddingLeft: 10,
		height: 30,
		marginLeft: 10,
	},
	dateView: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#79819c',
		borderRadius: 5,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		width: 230,
		marginTop: 10,
		height: 30,
		marginLeft: 10,
	},
	dateText: {
		fontSize: 17,
		color: '#FFF',
	}
	 
});


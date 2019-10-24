import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import {ImagePicker,  MapView } from 'expo';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import moment from 'moment';

import { Bubbles } from 'react-native-loader';
import getDirections from 'react-native-google-maps-directions'

import { EMP_ID, BASE_URL, APP_TOKEN, PRINT } from '../../store/actions/AppConst';

import { Container, Header, Title, Content, Left, Right, Body , Form, Item,Label, Input, Textarea } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, Alert, Platform } from 'react-native';
import MenuIcon from '../../images/back_arrow.png';
import AcceptIcon from '../../images/accept_icon.png';
import RejectIcon from '../../images/reject_icon.png';
import FinishIcon from '../../images/finish_icon.png';
import TaskProofIcon from '../../images/task_proof_icon.png';
import DirectionIcon from '../../images/direction_icon.png';
import CameraIcon from '../../images/camera_icon.png';


import StartIcon from '../../images/start_icon.png';

import { AcceptTask, DismissAlert, CompleteTask, UpdateTaskStatus, UpdateImageURI } from '../../store/actions/TaskActions';
import { BackHandler } from 'react-native';


class GroupTaskDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			 remarks: '',
			 image: null,
			 uploadImage: null,
			 isUploading: false,
			 isCompleted: false,
			 location: null,
			 errorMessage: null,
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
	
	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
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
	
	
	  _pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.All,
		  allowsEditing: true,
		  aspect: [4, 3],
		  quality: 0.5
		});
	
		// console.log(result);
		if (!result.cancelled) {

			this.props.UpdateImageURI({ uri : result.uri});
		  	this.setState({ image: result.uri, uploadImage: result, isUploading: true });
		  	this.onUploadFile();
		}
	  };
	
	onTapMenuButton = () => {
		this.props.navigation.goBack();
	}

	onTapAccept = () => {
		
		const task  = this.props.navigation.getParam('task');
		const emp_id = EMP_ID();
		const task_id = task.id;
		const client_id = task.client_id;
		this.props.AcceptTask({ emp_id, task_id, client_id});

	}

	onUploadFile = () => {

		const task  = this.props.navigation.getParam('task');
		const task_id = task.id;
		const { image_uri } = this.props;

		const file_name = 'task_proof_'+task_id+'.jpg';

		var data = new FormData();  
		data.append('file', {  
		  uri: image_uri.uri, // your file path string
		  name: file_name,
		  type: 'image/jpeg'
		});

		const app_token = APP_TOKEN();

		fetch(BASE_URL+'upload-task', {  
			headers: {
			  'Accept': 'application/json',
			  'Authorization':  app_token,
			  'Content-Type': 'multipart/form-data'
			},
			method: 'POST',
			body: data
		  }).then((response) => response.json())
		  .then((responseJson) => {
			  
				PRINT(`FIle Uploaded Successfully ${JSON.stringify(responseJson)}`);

			  this.setState({ isUploading: false});
				console.log("Response will be :" + JSON.stringify(responseJson));
		  })
		  .catch((error) => {

			PRINT(`Error While Uploading file ${error}`);
			this.setState({ isUploading: false});
				console.error(error);
		  });
	}

	onTapReject = () => {
		const task  = this.props.navigation.getParam('task');
		const emp_id = EMP_ID();
		const task_id = task.id;
		const status = 1;

		Alert.alert(
			'Later followup !',
			"Are you sure to make it Later followup?",
			[
				{text: 'Cancel', onPress: () => {} },
			  {text: 'OK', onPress: () => {
				this.props.UpdateTaskStatus({ emp_id, task_id, status});

				}
			},
			
			],
			{cancelable: false},
		  );

	}

	onTapStart = () => {
		const task  = this.props.navigation.getParam('task');
		const emp_id = EMP_ID();
		const task_id = task.id;
		const status = 2;
		this.props.UpdateTaskStatus({ emp_id, task_id, status});
 
	}

	onTapFinish = () => {
		
		
		this.setState({ isCompleted: true});
		const task  = this.props.navigation.getParam('task');
		const emp_id = EMP_ID();
		const task_id = task.id;
		const { remarks } = this.state;
		const { lat, lng, client_id } = task;

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
		
		else if(lat === 0 && lng === 0){
			const { latitude,longitude} = this.state.location.coords;
			Alert.alert(
				'Complete Task!',
				"Client location is need to update to improve Navigation Service!",
				[
					{text: 'Cancel', onPress: () => {
							this.props.CompleteTask({ emp_id, task_id, remarks,latitude, longitude, update: false });
					} 
					},
				  {text: 'Update & Finish Task', onPress: () => {
						this.props.CompleteTask({ emp_id, task_id, remarks,latitude, longitude, update: true, client_id });
					}
				},
				
				],
				{cancelable: false},
			  );


		}else{
			const { latitude,longitude} = this.state.location.coords;
			this.props.CompleteTask({ emp_id, task_id, remarks,latitude, longitude, update: false });
		}

	}


	onTapCamera = () => {
		const task  = this.props.navigation.getParam('task');
		this.props.navigation.navigate('Camera', {task: task});
	}


	onTapToNavigate = () => {

		const task  = this.props.navigation.getParam('task');
		const { location } = this.state;

		const data = {
			source: {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
		   },
		   destination: {
				latitude: task.lat,
				longitude: task.lng
		   },
		   params: [
			 {
			   key: "travelmode",
			   value: "driving"        // may be "walking", "bicycling" or "transit" as well
			 },
			 {
			   key: "dir_action",
			   value: "navigate"       // this instantly initializes navigation using the given travel mode
			 }
		   ],
		   waypoints: [
			  
	  
		   ]
		 };

		 getDirections(data)

	}


	taskStatusView = (task) => {

		switch(task.status){
			case 0: // waiting for Accept
			case 1: // accepted
				return (
					<TouchableOpacity onPress={this.onTapStart}>
						<View style={[styles.genericStatus, { 
										borderRadius: 21,
										width: 320,
										height: 52,
										backgroundColor: '#32975D', flexDirection: 'row', justifyContent: 'space-around'}]}>
							<Text style={styles.statusText}> Tap to Start </Text>
							<Image source={StartIcon} style={{width: 32, height: 32}} />
						</View>
					</TouchableOpacity>
				);
			case 2: // started
				return (
					<View style={[styles.genericStatus, {backgroundColor: '#D8A367'}]}>
						<Text style={styles.statusText}> In Progress </Text>
					</View>
				);
			case 3: // completed
				return (
					<View style={[styles.genericStatus, {backgroundColor: '#1E8449'}]}>
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

	taskCompletionView = (task) => {

		const { image_uri } = this.props;

		const imageLink = BASE_URL+'uploads/task_proof_'+task.id+'.jpg';
		 
		if(task.status === 2){

			return(
				<View>
	
					<View style={styles.itemStyle}>
						<Text style={styles.taskPlaceHolder}> Task Closure Comment</Text>
						<Textarea  style={styles.commentText} onChangeText={(text) => (this.setState({
							remarks: text
						}))} rowSpan={7} bordered placeholder="Task Completion Comment!" value={this.state.remarks} />
					</View>

					<View style={[styles.itemStyle, {flexDirection:'row', alignItems: 'flex-end'}]}>
						{image_uri && (
							<View>
							<Image source={image_uri} style={{ width: 60, height: 60 }} />
							{ this.state.isUploading && (<View style={styles.uploadProgress}>
							<Bubbles size={10} color="#501094" />
							</View>)}
						</View>
						)}
						<TouchableOpacity onPress={this._pickImage} style={{ marginRight: 20}}>
							<Image style={styles.uploadImage} source={TaskProofIcon} />
						</TouchableOpacity>
						<TouchableOpacity onPress={this.onTapCamera} style={{ marginRight: 20}}>
							<Image style={styles.uploadImage} source={CameraIcon} />
						</TouchableOpacity>
					</View>


					<View style={[styles.itemStyle, {flexDirection: 'row', alignContent:'center', justifyContent:'center'}]}>
						<TouchableOpacity onPress={this.onTapFinish} style={[styles.butonView, { width: 150}]}>
								<Image style={styles.menuIcon} source={FinishIcon} />
								<Text style={styles.buttonText}>Finish Task</Text>
						</TouchableOpacity>
					</View>

				</View>
			);

		}else if(task.status === 3){

			return (

				<View style={[styles.itemStyle, {flexDirection:'row', alignItems: 'center', justifyContent: 'center'}]}>
					<Image source={{ uri: imageLink }} style={{ width: 320, height: 200 }} />
				</View>
			 
			);

		}
 

	}

	render() {

		const { navigation, isAccepted, isFinished, isUpdated } = this.props;

		const { location } = this.state;

		const task  = navigation.getParam('task');

		let text = 'Waiting..';

		if (this.state.errorMessage) {
			text = this.state.errorMessage;
		} else if (this.state.location) {
			text = JSON.stringify(this.state.location);
		}

		 if(isFinished === true){
			Alert.alert(
				'Task Completed!',
				'Successfully completed selected Task!',
				[
				  {text: 'OK', onPress: () => {
						this.props.navigation.goBack();
						this.props.DismissAlert('')
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
						this.props.navigation.goBack();
						this.props.DismissAlert('')
					}
				},
				],
				{cancelable: false},
			  );
		}

		const coords = {
			latitude: task.lat,
			longitude: task.lng,
		};

		const metadata = task.client_name+','+task.address;

		const lattitude = task.lat;
		const longitude = task.lng;

		console.log(JSON.stringify(task));

		if(this.state.isCompleted ) {

			return (<View style={[styles.uploadProgress, {flex: 1}]}>
					<Bubbles size={10} color="#501094" />
					<Text style={styles.loadingText}>Please wait...</Text>
				</View>);
		}else {

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
								<Title style={styles.title}>Group Task Details</Title>
							</Body>
							<Right />
						</Header>
						<Content>
							<View style={{ width: '100%' ,justifyContent: 'center', alignContent:'center', alignItems: 'center', paddingTop: 10}}>
									{this.taskStatusView(task)}
							</View>
							
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Task Title </Text>
								<Text style={styles.taskText}>{task.title}</Text>
							</View>
	
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Descriptions</Text>
								<Text style={styles.taskText}>{task.description}</Text>
							</View>
	
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Appointment Date</Text>
								<Text style={styles.taskText}>{moment(task.appointment_date).format('Do MMM YYYY')}</Text>
							</View>
	
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Client Name</Text>
								<Text style={styles.taskText}>{task.client_name}</Text>
							</View>
	
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Address</Text>
								<Text style={styles.taskText}>{task.address}</Text>
							</View>
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Contact Person</Text>
								<Text style={styles.taskText}>{task.contact_person}</Text>
							</View>
	
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Phone Number</Text>
								<Text style={styles.taskText}>{task.client_phone}</Text>
							</View>
	
							{task.status < 3 && lattitude !== 0 && longitude !== 0 && (

											<View style={styles.itemStyle}>
											<Text style={styles.taskPlaceHolder}> Location</Text>

											<MapView
												style={{
												width: '100%', height: 300,
												padding: 10,
												}}

												initialRegion={{
												latitude: lattitude,
												longitude: longitude,
												latitudeDelta: 0.0922,
												longitudeDelta: 0.0421
												}}
											>
												<MapView.Marker
													key='0'
													coordinate={coords}
													title='Destination'
													description={metadata}
												/>
											</MapView>

											{location !== null && (
												<View style={{ width: '100%' ,justifyContent: 'center', alignContent:'center', alignItems: 'center', paddingTop: 10}}>
													<TouchableOpacity onPress={this.onTapToNavigate}>
														<View style={[styles.genericStatus, { width: 160, height: 80, borderRadius: 40 ,backgroundColor: '#54B83D', flexDirection: 'column', justifyContent: 'space-around'}]}>
															<Image source={DirectionIcon} style={{width: 44, height: 44}} />
															<Text style={styles.statusText}> Navigate </Text>
														</View>
													</TouchableOpacity>
												</View>
											)}

											</View>

							)}
							
							
							{this.taskCompletionView(task)}

						</Content>
						 
					</Container>
				</SafeAreaView>
			);
		}
		
	}
}

const mapStateToProps = (state) =>({
	isAccepted: state.taskReducer.isAccepted,
	isFinished: state.taskReducer.isFinished,
	isUpdated: state.taskReducer.isUpdated,
	image_uri: state.taskReducer.image_uri,

});

export default connect(mapStateToProps, { AcceptTask, DismissAlert, CompleteTask, UpdateTaskStatus, UpdateImageURI  })(GroupTaskDetails);

const styles = StyleSheet.create({
    
	container: {
		marginTop: Platform.OS === 'ios' ? 0 : 23,
		flex: 1,
		backgroundColor: '#fcfcfc'
	},
	uploadProgress: {
		justifyContent: 'center',   
		alignItems: 'center',

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
		width: 151,
		color:'#000',
		alignItems: 'center',
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
	itemStyle:{
		minHeight: 50,
		flexDirection:'column',
		alignItems: 'flex-start',
		margin: 5,
		marginBottom: 10,
		justifyContent: 'space-between',

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
	loadingText: {
		color: '#c5c6c7',
		fontSize: 16,
		marginTop: 5
	},
	statusText:{
		color: '#FFFF',
		fontSize: 20,
	}
	,
	genericStatus: {
		backgroundColor: '#46B335',
		borderRadius: 0,
		width: '100%',
		height: 80,
		alignItems: 'center',
		justifyContent: 'center'
	},
	 
	 
});

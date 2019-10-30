import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';

import { connect } from 'react-redux';
import { KeyboardAvoidingView} from 'react-native';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';

import { Container, Header, Title, Content, Left, Right, Body, Textarea, Input, Item, Picker , DatePicker} from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, ScrollView, Platform, Alert } from 'react-native';
import MenuIcon from '../../images/back_arrow.png';
import { AddTask, GetClients, DismissAlert, AddNewClient } from '../../store/actions/TaskActions';
import FinishIcon from '../../images/finish_icon.png';
import { EMP_ID } from '../../store/actions/AppConst';
import { BackHandler } from 'react-native';

class AddTaskView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			client_id: '',
			client_name: '',
			task_title: '',
			client_address: '',
			phone_number: '',
			contact_person: '',
			lat: 0.0,
			lng: 0.0,
			remarks: '',
			description: '',
			priority: '',
			appointment_date: new Date(),
			isNewClient: false,
			email: '',

		};

		this.state = {appointment_date: new Date()};

		this.setDate = this.setDate.bind(this);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		this.props.GetClients('');

	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}

	setDate(newDate) {
		this.setState({appointment_date: newDate});
	}

	onTapMenuButton = () => {

		this.props.navigation.goBack();
	}

	onViewTaskDetails = (task) => {
		
		this.props.navigation.navigate('TaskDetails', {task: task})
	}

	onChangeClient = (value)  => {

		if(value === null){
			return;
		}else{

			if(value === 'New'){
				this.setState({
					client: value,
					isNewClient: true,
					client_name: '',
					client_address: '',
					client_phone: ''
				});
			}else{

				const { clients } = this.props;
				
				let client = clients.find(u => u.id === value);

				this.setState({
					client_id: client.id,
					client_name: client.client_name,
					client_address: client.address,
					phone_number: client.client_phone,
					lat: client.lat,
					lng: client.lng,
					isNewClient: false
				});
			}

		}

	}

	onChangePriority = (value)  => {

		this.setState({
			priority: value,
		}); 

	}

	onAddTask = () =>{

		isCompleted = true;
		const emp_id = EMP_ID();
		const { client_id, priority ,task_title, email, client_address, client_name,phone_number, contact_person, remarks, description, appointment_date, lat, lng } = this.state;

		if(this.state.isNewClient){

			if(client_name === ""){
				this.onShowAlert('Client Name is Required!');
				return;
			}else if(client_address === ""){
				this.onShowAlert('Client Address is Required!')
				return;
			} else if(phone_number === ""){
				this.onShowAlert('Client Contact Number is Required!');
				return;
			}	

			this.props.AddNewClient({ client_name, emp_id, client_address, phone_number, contact_person,  appointment_date, email });		

		}else{

			if(task_title === ""){
				this.onShowAlert('Task Title is Empty');
				return;
			}else if(description === ""){
				this.onShowAlert('Task Description is Empty')
				return;
			} else if(client_id === ""){
				this.onShowAlert('Select Client for this task');
				return;
			}	
	
			this.props.AddTask({ client_id, emp_id, priority, task_title, client_address, phone_number, contact_person, remarks, description, appointment_date, lat, lng});		
	
		}

	}
	
	onShowAlert = (msg) =>{

		Alert.alert(
			'Error on Adding Task!',
			''+msg,
			[
			  {text: 'OK', onPress: () => {
				
			}},
			],
			{cancelable: false},
		  );
		  return;

	}



	onChangeClient = (value) => {

		if(value === 'New'){
			this.setState({
				client: value,
				isNewClient: true,
				client_name: '',
				client_address: '',
				client_phone: ''
			});
		}else{
			this.setState({
				client: value,
				isNewClient: false
			});
		}
		 
	}

	newClient = () => {

		const { client_name ,contact_person, client_address, phone_number, email } = this.state;

		return (
			<View>
				<View style={styles.itemStyle}>
					<Item>
						<Input first  placeholder="New Client Name" value={client_name} onChangeText={(text) => this.setState({client_name: text})}/>
					</Item>
				</View>

				<View style={styles.itemStyle}>
					<Item>								
						<Textarea  style={styles.commentText} onChangeText={(text) => (this.setState({
							client_address: text
						}))} rowSpan={4} bordered placeholder="Client Address" value={client_address} />
					</Item>
				</View>

				<View style={styles.itemStyle}>
					<Item>
						<Input first  placeholder="Email ID" value={email} onChangeText={(text) => this.setState({email: text})}/>
					</Item>
				</View>
				
				<View style={styles.itemStyle}>
					<Item>
						<Input first  placeholder="Contact Person" value={contact_person} onChangeText={(text) => this.setState({contact_person: text})}/>
					</Item>
				</View>

				<View style={styles.itemStyle}>
					<Item>
						<Input first  placeholder="Phone Number" value={phone_number} onChangeText={(text) => this.setState({phone_number: text})}/>
					</Item>
				</View>
				
			</View>
		);

	}


	render() {


		const placeholder = {
			label: 'Select a Client',
			value: null,
			color: '#9EA0A4',
		  };

		const { clients, isAdded } = this.props;

		const { isCompleted, task_title,  description } = this.state;

		if(isAdded === true){
			Alert.alert(
				'Task Added!',
				'New Task is Added to your Task List!',
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

		if(isCompleted ) {

			return (<View style={[styles.uploadProgress, {flex: 1}]}>
					<Bubbles size={10} color="#501094" />
					<Text style={styles.loadingText}>Please wait...</Text>
				</View>);
		}else {

			return (
				<SafeAreaView style={styles.container}>

					<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

						<Container>

							<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
								<Left>
									<TouchableOpacity onPress={this.onTapMenuButton}>
										<Image source={MenuIcon} style={styles.menuIcon} />
									</TouchableOpacity>
								</Left>
								<Body style={styles.taskHeader}>
									<Title>Add New Task</Title>
								</Body>
								<Right />
							</Header>

							<Content>

							<View style={styles.itemStyle}>
									<Text style={styles.taskPlaceHolder}> Select Client</Text>
									<RNPickerSelect
											placeholder={placeholder}
											style={
												Platform.OS === 'ios'
												? styles.inputIOS
												: styles.inputAndroid
											}
											blurOnSubmit={false}
											onValueChange={(value) => this.onChangeClient(value)}
											items={clients}
										/>
									 
							</View>
 
								{this.state.isNewClient ? this.newClient() : 

									<View>
										<View style={styles.itemStyle}>
										<Item>
											<Input first  placeholder="Enter Task Title" value={task_title} onChangeText={(text) => this.setState({task_title: text})}/>

										</Item>
										</View>
				
										<View style={styles.itemStyle}>
											<Item>								
												<Textarea  style={styles.commentText} onChangeText={(text) => (this.setState({
													description: text
												}))} rowSpan={7} bordered placeholder="Enter Task Descriptions Here!" value={description} />
											</Item>
										</View>
									
									</View>
								}
		
								<View style={styles.itemStyle}>
									<DatePicker
									defaultDate={new Date()}
									minimumDate={new Date()}
									maximumDate={new Date(2022, 12, 31)}
									locale={"en"}
									timeZoneOffsetInMinutes={undefined}
									modalTransparent={false}
									animationType={"fade"}
									androidMode={"default"}
									placeHolderText="Tap to Select Appointment Date"
									textStyle={{ color: "green" }}
									placeHolderTextStyle={{ color: "#716F73" }}
									onDateChange={this.setDate}
									disabled={false}
									/>
								</View>
		
								<View>
									<View style={[styles.itemStyle, {flexDirection: 'row', alignContent:'center', justifyContent:'center'}]}>
										<TouchableOpacity onPress={this.onAddTask} style={[styles.butonView, { width: 150}]}>
												<Image style={styles.menuIcon} source={FinishIcon} />
												<Text style={styles.buttonText}>Add Task</Text>
										</TouchableOpacity>
									</View>

								</View>
								
							</Content>
							
						</Container>
					</KeyboardAvoidingView>
				</SafeAreaView>
			);
	}

}

}

const mapStateToProps = (state) => ({
	clients: state.taskReducer.clients,
	isAdded: state.taskReducer.isAdded
});
 
export default connect(mapStateToProps, { AddTask, GetClients, DismissAlert, AddNewClient })(AddTaskView);
 
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
		alignItems: 'center',
	},
	taskPlaceHolder:{
		width: '98%',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft:15,
		fontSize: 16,
		backgroundColor: '#f9f9f9',
		borderColor: '#242427',
		borderBottomWidth: 1,
		marginBottom: 5,
	},
	taskText:{
		fontSize: 18,
		color: '#242427',
		marginBottom: 5,
		marginLeft: 5
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
		paddingLeft: 10,
		paddingRight: 10,
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
	inputIOS: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	  },
	  inputAndroid: {
		fontSize: 16,
		width: 300,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: '#CCDDFF',
		borderRadius: 8,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	  },
	  selectView: {
		marginLeft: 20,
		height: 30,
		width: 300,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignContent: 'center',
		alignItems: 'center',
	}
	 
});


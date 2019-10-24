import React, { Component } from 'react';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import {ImagePicker, Permissions, Constants} from 'expo';
import { Bubbles } from 'react-native-loader';

import { Container, Header, Title, Content, Left, Right, Body , Form, Item,Label, Input, Textarea, Picker } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, Alert, AsyncStorage, Platform } from 'react-native';
import MenuIcon from '../../images/back_arrow.png';
import FinishIcon from '../../images/finish_icon.png';
import UserIcon from '../../images/default_user.png';
import Store from '../../store/Stores';
import TaskProofIcon from '../../images/task_proof_icon.png';
import { KeyboardAvoidingView} from 'react-native';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import CameraIcon from '../../images/camera_icon.png';

import {connect} from 'react-redux';
import { EMP_ID , CURRENCY, APP_TOKEN, BASE_URL } from '../../store/actions/AppConst';
import { AddExpenses ,DismissAlert, ViewMyTask} from '../../store/actions/ExpensesAction';

import { BackHandler } from 'react-native';

const options = {
	title: 'Select Profile Picture',
	customButtons: [{name: 'Pick Image ', title: 'Chose photo from picker'}],
	storageOptions: {
		skipBackup: true,
		path: 'images',
	}
}

class AddExpensesView extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			emp_id: EMP_ID(),
			headline: '',
			descriptions: '',
			completion_date: '',
			total_expenses: '',
			total_km: '',
			task_id: '',
			client_id: '',
			client_name: '',
			image: null,
			uploadImage: null,
			isUploading: false,
			isCompleted: false,
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
		this._subscribe = this.props.navigation.addListener('didFocus', () => {
			this.props.ViewMyTask({emp_id: EMP_ID()});
		});

		this.getPermissionAsync();
	}
 
	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
		  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		  if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to upload proof of Task!');
		  }
		}
	  }
	
	  _pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.All,
		  allowsEditing: true,
		  aspect: [4, 3],
		});
		// console.log(result);

		if (!result.cancelled) {
		
		  this.setState({ image: result.uri, uploadImage: result, isUploading: true });
		  this.onUploadFile();
		}
	  };


	  onUploadFile = () => {

		
		const { image,task_id } = this.state;
		const file_name = 'evidence_'+task_id+'.jpg';

		var data = new FormData();  
		data.append('file', {  
		  uri: image, // your file path string
		  name: file_name,
		  type: 'image/jpeg'
		});

		const app_token = APP_TOKEN();

		fetch(BASE_URL+'upload-expense', {  
			headers: {
			  'Accept': 'application/json',
			  'Authorization':  app_token,
			  'Content-Type': 'multipart/form-data'
			},
			method: 'POST',
			body: data
		  }).then((response) => response.json())
		  .then((responseJson) => {
			  this.setState({ isUploading: false});
			console.log("Response will be :" + JSON.stringify(responseJson));
		  })
		  .catch((error) => {
			this.setState({ isUploading: false});
				console.error(error);
		  });
	}

    componentWillReceiveProps(nextProps) {

		const {task} = nextProps;
		if(task !== undefined){
			 
		}
    }
 
	onTapMenuButton = () => {
		this.props.navigation.goBack();
	}

	onTapSaveChanges = () => {
		const { emp_id,
			headline,
			descriptions,
			total_expenses,
			task_id,
			client_id } = this.state; 

			const currency = CURRENCY();


			if(headline === ""){
				Alert.alert(
					'Error on Adding Expenses!',
					'Please Select Expenses for acomplish task',
					[
					  {text: 'OK', onPress: () => {
						
					}},
					],
					{cancelable: false},
				  );
				  return;
			}else if(descriptions === ""){
				Alert.alert(
					'Error on Adding Expenses!',
					'Please  select expenses type',
					[
					  {text: 'OK', onPress: () => {
						
					}},
					],
					{cancelable: false},
				  );
				  return;
			}else if(total_expenses === ""){
				Alert.alert(
					'Error on Adding Expenses!',
					'Please enter Amount',
					[
					  {text: 'OK', onPress: () => {
						
					}},
					],
					{cancelable: false},
				  );
				  return;
				
			}


		this.props.AddExpenses({ emp_id,
			headline,
			descriptions,
			total_expenses,
			task_id,
			client_id ,
			currency});

	}

	onTapCamera = () => {
		this.props.navigation.navigate('Camera');
	}

  
	onChangeTask = (value)  => {

		if(value === null){
			return;
		}
		const { tasks } = this.props;
		let task = tasks.find(u => u.id === value);

		this.setState({
			client_id: task.client_id,
			task_id: task.id,
			client_name: task.client_name,
			headline: task.title
		}); 

	}


	onChangeExpensesType = (value) => {

		this.setState({
			descriptions: value
		}); 

	}

	 
	render() {

		const {isAdded, tasks} = this.props;

		const { image } = this.state;

		const placeholder = {
			label: 'Select a Task',
			value: null,
			color: '#9EA0A4',
		  };


		
		if(isAdded === true){
			Alert.alert(
				'Expense Added',
				'Successfully Sent for Reimbursement!',
				[
				  {text: 'OK', onPress: () => {
					  this.props.DismissAlert('')
					  this.props.navigation.goBack();
				}},
				],
				{cancelable: false},
			  );
		}

		const { total_expenses, client_name } = this.state;
		
			 
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
							<Title style={styles.title}>Add Expense</Title>
						</Body>
						<Right />
					</Header>
					<Content style={styles.contentbg}>
						 
					<Form>
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Expenses For *</Text>
								<RNPickerSelect
										style={{ width: '100%',color: '#0000'}}
										placeholder={placeholder}
										style={
											Platform.OS === 'ios'
											  ? styles.inputIOS
											  : styles.inputAndroid
										  }
										blurOnSubmit={false}
										onValueChange={(value) => this.onChangeTask(value)}
										items={tasks}
									/>

							</View>
							{client_name !== '' && <View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Client :  {client_name}</Text>
							</View> }

							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Expenses Type *</Text>
								<Item picker>
									<Picker
										mode="dropdown"
										style={{ width: undefined }}
										placeholder="Expenses Type"
										placeholderStyle={{ color: "#bfc6ea" }}
										placeholderIconColor="#007aff"
										selectedValue={this.state.descriptions}
										onValueChange={this.onChangeExpensesType.bind(this)}
									>
									<Picker.Item label='Bus' value='Bus' key={0} />
									<Picker.Item label='Train' value='Train' key={1} />
									<Picker.Item label='Auto' value='Auto' key={2} />
									<Picker.Item label='Bike' value='Bike' key={3} />
									<Picker.Item label='Food' value='Food' key={4} />
									<Picker.Item label='Others' value='Others' key={5} />
								</Picker>
								</Item>
								
							</View>

							{this.state.descriptions === 'Bike' && 
								<View style={styles.itemStyle}>
									<Text style={styles.taskPlaceHolder}> KM</Text>
									<Input keyboardType="numeric"  style={styles.taskText} placeholder="eg: 30" value={total_km} onChangeText={(text) => this.setState({total_km: text})}/>
								</View>
							}

							

							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Total Expenses *</Text>
								<Input keyboardType="numeric"  style={styles.taskText} placeholder="Amount" value={total_expenses} onChangeText={(text) => this.setState({total_expenses: text})}/>
							</View>
						</Form>

						<View style={[styles.itemStyle, {flexDirection:'row', alignItems: 'flex-end'}]}>
										{image && (
								<View>
								<Image source={{ uri: image }} style={{ width: 60, height: 60 }} />
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
							<TouchableOpacity onPress={this.onTapSaveChanges} style={[styles.butonView, { width: 180}]}>
									<Image style={styles.menuIcon} source={FinishIcon} />
									<Text style={styles.buttonText}>Add Expense</Text>
							</TouchableOpacity>

						</View>

					</Content>
					 
				</Container>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	tasks: state.expensesReducer.tasks,
	isAdded: state.expensesReducer.isAdded,
});

export default connect(mapStateToProps, { AddExpenses, ViewMyTask, DismissAlert })(AddExpensesView);

const styles = StyleSheet.create({
    
	container: {
		marginTop: Platform.OS === 'ios' ? 0 : 23,
		flex: 1,
		backgroundColor: '#f9f9f9'
	},
	contentbg:{
		backgroundColor: '#f9f9f9'
	},
	header:{
		backgroundColor: '#212654',
		flex: 1,
		flexDirection: 'row',
	},
	userIcon:{
		width: 120,
		height: 120,
	},
	welcomeTitle:{
		fontSize: 16,
		marginTop: 20,
		color: '#838281'
	},
	menuIcon: {
		width: 40,
		height: 40
	},
	title: {
		fontSize: 16,
		color: '#000',
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
	
	},
	taskText:{
		fontSize: 18,
		color: '#242427',
		borderColor: '#e0e1e2',
		borderBottomWidth: 1,
		width: '90%',
		marginLeft: 15,
		marginRight: 15,
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
		backgroundColor: '#f9f9f9'

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
		width: 250,
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
	uploadImage: {
		width: 60,
		height: 60
	},uploadProgress: {
		justifyContent: 'center',   
		alignItems: 'center',

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

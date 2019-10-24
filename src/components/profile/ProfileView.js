import React, { Component } from 'react';
import { SafeAreaView, NavigationEvents } from 'react-navigation';

import Constants from 'expo-constants'

import Permissions from 'expo-permissions'

import {ImagePicker} from 'expo';
import { Bubbles } from 'react-native-loader';

import {KeyboardAvoidingView} from 'react-native';

import { Container, Header, Title, Content, Left, Right, Body , Form, Item,Label, Input, Textarea } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, Alert, AsyncStorage, Platform } from 'react-native';
import MenuIcon from '../../images/menu_icon.png';
import FinishIcon from '../../images/finish_icon.png';
import UserIcon from '../../images/default_user.png';

import {connect} from 'react-redux';

import { EMP_ID, BASE_URL, APP_TOKEN } from '../../store/actions/AppConst';

import { ViewUser, EditUser , DismissAlert} from '../../store/actions/UserActions';
import { BackHandler } from 'react-native';


class ProfileView extends Component {
	
	constructor(props) {
		super(props);

		const emp_id = EMP_ID();

		const profilePicUrl = BASE_URL+'uploads/profile_pic_'+emp_id+'.jpg';


		this.state = {
			emp_id: emp_id,
			profilePic: profilePicUrl,
			name: '',
			email: '',
			mobile: '',
			isUploading: false
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

			this.setState({ emp_id: EMP_ID()})
			this.props.ViewUser({emp_id: EMP_ID()});
		});

		this.getPermissionAsync();
	}
 
	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
		  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		  if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to Access Profile Picture!');
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

		  this.setState({ profilePic: result.uri, uploadImage: result, isUploading: true });
		  this.onUploadFile();
		}
	  };


	  onUploadFile = () => {

		const emp_id = EMP_ID();
		
		const { profilePic } = this.state;
		const file_name = 'profile_pic_'+emp_id+'.jpg';

		console.log('Profile Pic URL:'+ profilePic);
		

		var data = new FormData();

		data.append('file', {  
		  uri: profilePic, // your file path string
		  name: file_name,
		  type: 'image/jpeg'
		});

		const app_token = APP_TOKEN();

		fetch(BASE_URL+'upload-profile', {  
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

		const {user} = nextProps;
		if(user !== undefined){
			this.setState({
				name: user.name,
				email: user.email,
				mobile: user.mobile
   
		   });
		}

    }
 
	onTapMenuButton = () => {
		this.props.navigation.openDrawer();
	}
 


	onTapSaveChanges = () => {
		const { emp_id,name,
			email,
			mobile } = this.state; 

		this.props.EditUser({ emp_id,name, email, mobile });
	}
 

	onTapReject = () => {
		this.props.navigation.goBack();
	}

	onTapFinish = () => {
		alert('Finish Task');
	}
	  
	render() {

		const {isAdded} = this.props;
 
		
		if(isAdded === true){
			Alert.alert(
				'Edit Profile',
				'Successfully Saved Changes!',
				[
				  {
					text: 'Cancel',
					onPress: () => this.props.DismissAlert(''),
					style: 'cancel',
				  },
				  {text: 'OK', onPress: () => this.props.DismissAlert('')},
				],
				{cancelable: false},
			  );
		}

		const { profilePic, name,
			email,
			mobile, } = this.state;
			
			 
 
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
							<Title style={styles.title}>Edit Profile</Title>
						</Body>
						<Right />
					</Header>
					<Content>
					<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
						 
					<Form>
							<View style={[styles.itemStyle, { alignContent: 'center', alignItems:'center', flexDirection: 'column'}]}>
								<TouchableOpacity onPress={this._pickImage}>								
									<Image source={{ uri: profilePic }}  style={styles.userIcon} defaultSource={UserIcon}/>
								</TouchableOpacity>
								{ this.state.isUploading && (<View style={styles.uploadProgress}>
										<Bubbles size={10} color="#501094" />
									</View>)}
								<Text style={styles.welcomeTitle}>Welcome, {name }</Text>
							</View>

							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Full Name</Text>
								<Input   style={styles.taskText} placeholder="Full Name"  value={name}  onChangeText={(text) => this.setState({name: text})}/>
							</View>

							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Mobile</Text>
								<Input   style={styles.taskText} placeholder="Mobile Number" value={mobile} onChangeText={(text) => this.setState({mobile: text})} />
							</View>
							<View style={styles.itemStyle}>
								<Text style={styles.taskPlaceHolder}> Email ID</Text>
								<Input last style={styles.taskText} placeholder="Email Id" value={email}  onChangeText={(text) => this.setState({email: text})}/>
							</View>

						</Form>

						<View style={[styles.itemStyle, {flexDirection: 'row', alignContent:'center', justifyContent:'center'}]}>
							<TouchableOpacity onPress={this.onTapSaveChanges} style={[styles.butonView, { width: 180}]}>
									<Image style={styles.menuIcon} source={FinishIcon} />
									<Text style={styles.buttonText}>Save Changes</Text>
							</TouchableOpacity>

						</View>

						</KeyboardAvoidingView>

					</Content>
					 
				</Container>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.userReducer.current_user,
	isAdded: state.userReducer.isAdded,
	isLogedIn: state.userReducer.isLogedIn
});

export default connect(mapStateToProps, { ViewUser, EditUser, DismissAlert })(ProfileView);

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
	userIcon:{
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 1,
		borderColor: '#FFFF'
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
	uploadProgress: {
		justifyContent: 'center',   
		alignItems: 'center',

	},
	 
});

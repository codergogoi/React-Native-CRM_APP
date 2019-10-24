import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';

import { Container, Header, Title, Content, Left, Right, Body , Form, Item,Label, Input } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, Alert, Platform, AsyncStorage } from 'react-native';
import MenuIcon from '../../images/menu_icon.png';
import AcceptIcon from '../../images/accept_icon.png';
import RejectIcon from '../../images/reject_icon.png';
import FinishIcon from '../../images/finish_icon.png';
import UserIcon from '../../images/default_user.png';

import { EMP_ID } from '../../store/actions/AppConst';

import {connect} from 'react-redux';

import { ChangePassword, DismissAlert } from '../../store/actions/UserActions';
import { BackHandler } from 'react-native';

class SettingsView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			 old_password: '',
			 new_password: '',
		};
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	_storeData = async () => {

		try {
			  await AsyncStorage.setItem('user_password', this.state.new_password);
			  this.setState({
				old_password: '',
				new_password: '',
			});
		} catch (error) {
		  // Error saving data
		  	// console.log(`Error encountered ${error}`);
		}
	  };

	 

	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}

	onTapMenuButton = () => {
		this.props.navigation.openDrawer();
	}

	onTapChangePassword = () => {
		
		const emp_id = EMP_ID();
		const { old_password, new_password} = this.state;
		this.props.ChangePassword({ emp_id, old_password, new_password});

	}

 
	render() {
		 
		const { isPasswordChanged, isWrongPassword } = this.props;

		if(isPasswordChanged === true){
			Alert.alert(
				'Change Password!',
				'Password Successfully Changed!',
				[
				  {text: 'OK', onPress: () => {
						this._storeData();
						this.props.DismissAlert('')
					}
				},
				],
				{cancelable: false},
			  );
		}else if(isWrongPassword === true){
			Alert.alert(
				'Wrong Password!',
				'Old Password Does not match!!',
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
			<SafeAreaView style={styles.container}>
				<Container>
				<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
						<Left>
							<TouchableOpacity onPress={this.onTapMenuButton}>
								<Image source={MenuIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Left>
						<Body style={styles.taskHeader}>
							<Title style={styles.title}>Settings</Title>
						</Body>
						<Right />
					</Header>
					<Content>
					
						<Form>
								<View style={styles.itemStyle}>
									<Input secureTextEntry  style={styles.taskText} placeholder="Old Password" value={this.state.old_password} onChangeText={(text) => this.setState({
										old_password: text
									})}/>
								</View>
								<View last style={styles.itemStyle}>
									<Input secureTextEntry style={styles.taskText} placeholder="New Password" value={this.state.new_password} onChangeText={(text) => this.setState({
										new_password: text
									})} />
								</View>
						</Form>
						 
 
						<View style={[styles.itemStyle, {flexDirection: 'row', alignContent:'center', justifyContent:'center'}]}>
							<TouchableOpacity onPress={this.onTapChangePassword} style={[styles.butonView, { width: 180}]}>
									<Image style={styles.menuIcon} source={FinishIcon} />
									<Text style={styles.buttonText}>Save Changes</Text>
							</TouchableOpacity>

						</View>

					</Content>
					 
				</Container>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	isPasswordChanged: state.userReducer.isPasswordChanged,
	isWrongPassword: state.userReducer.isWrongPassword
});

export default connect(mapStateToProps, { ChangePassword, DismissAlert })(SettingsView);

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
		color: '#2F005E',
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

	}
	 
});

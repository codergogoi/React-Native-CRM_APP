import React, { Component } from 'react';
import { Button, Item, Input, Icon, Text, Form,Container, Content } from 'native-base';

import { View, ImageBackground, StyleSheet, Dimensions , AsyncStorage, Alert, Image } from 'react-native';
import loginBg from '../../images/login.jpg';
import AkbarLogo from '../../images/akbar_logo.png';
import BenzyLogo from '../../images/benzy_logo.png';


import { connect } from 'react-redux';

import { DoLogin, DidLoginPerformed, DoLogout, ForgotPassword, DismissAlert } from '../../store/actions/UserActions';

import { BackHandler } from 'react-native';
import { PRINT } from '../../store/actions/AppConst';
import { Platform } from '@unimodules/core';

class LoginView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			isLogin: false,
		};

		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}

	 componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	async componentDidMount(){
		this._retrieveData();

	}

	handleBackButtonClick() {
		BackHandler.exitApp();
    	return null;
	}

	_storeData = async () => {

		try {
		  	await AsyncStorage.setItem('user_id', this.state.email);
		  	await AsyncStorage.setItem('user_password', this.state.password);
			// console.log(' save is working...');
		} catch (error) {
		  // Error saving data
		  	// console.log(`Error encountered ${error}`);
		}
	  };

	  _retrieveData = async () => {
		try {
		  const uid = await AsyncStorage.getItem('user_id');
		  const password = await AsyncStorage.getItem('user_password');

		//   PRINT(`Saved Data ${uid} Password: ${password}`);

		  if (uid !== null &&  password !== null) {
				this.setState({
					email: uid,
					password: password
				});

				this.props.DoLogin({email: uid, password: password});

		  }else{
		  }
		} catch (error) {
		  // Error retrieving data
		//   console.log(`Error encountered ${error}`);

		}
	  };
	  
 
	componentWillReceiveProps(nextProps) {

		const {users, navigation, isLogedIn } = nextProps;

		if(users !== undefined){
			if(isLogedIn === true){
				if(users.app === true){
					this.setState({
						email: '',
						password: '',
					});
				navigation.navigate('Home')
				}else{
					Alert.alert(
						'Login Failed!',
						'Incorrect User ID and Password!',
						[
						  {text: 'OK'},
						],
						{cancelable: false},
					  );

				}
			}
		}

	}

	signIn = () => {
		
		this._storeData();
		const { email, password } = this.state;
		this.props.DoLogin({email, password});
	}; 

	onTapForgotPassword = () => {
		const {email} = this.state;
		this.props.ForgotPassword({email});
	}

	render() {

		const { email, password } = this.state;

		const { isSentPassword} = this.props;

		if(isSentPassword === true){
			Alert.alert(
				'Forgot Password!',
				'Password sent to your Registred Email ID!',
				[
				  {text: 'OK', onPress: () => {
					  this.props.DismissAlert('')
				}},
				],
				{cancelable: false},
			);
		}
		 
		return (
			<Container>
				<View style={styles.container}>
					<Content scrollEnabled={false}>
							<View style={styles.loginPanel}>
								<Image source={AkbarLogo} style={styles.akbarLogo} />
								
								<View style={styles.loginForeground}>
									<Form> 
										<Item style={{ marginBottom: 20}}>
											<Icon style={{ color: '#fff' }} name="ios-add" />
											<Input
												keyboardType="email-address"
												autoCapitalize="none"
												style={{ color: '#000' }}
												placeholder="Please Enter Email"
												placeholderTextColor="#dddd"
												onChangeText={(email) => this.setState({ email: email })}
												value={email}
											/>
										</Item>
										<Item style={{ marginBottom: 40 }}>
											<Icon style={{ color: '#fff' }} name="ios-add" />
											<Input
												style={{ color: '#000' }}
												placeholder="Please Enter Password"
												placeholderTextColor="#dddd"
												secureTextEntry={true}
												onChangeText={(pass) => this.setState({ password: pass })}
												value={password}
											/>
										</Item>

										<Button light rounded block style={styles.signupBtn} 
												onPress={this.signIn}
										>
											<Text style={{ color: '#FFF' }}>Login</Text>
										</Button>

										<Button light rounded block transparent style={styles.outlineBtn} 
												onPress={this.onTapForgotPassword}
										>
											<Text style={{ color: '#30ACFF' }}>Forgot Password?</Text>
										</Button>

									</Form>
								</View>

								<Image source={BenzyLogo} style={styles.benzyLogo} />
							</View> 
					</Content>
				</View>
			</Container>
			 
		);
	}
}

const mapStateToProps = (state) => ({
	users : state.userReducer.users,
	isLogedIn: state.userReducer.isLogedIn,
	isSentPassword: state.userReducer.isSentPassword
});

export default connect(mapStateToProps, { DoLogin, DidLoginPerformed, DoLogout, ForgotPassword, DismissAlert })(LoginView);

const styles = StyleSheet.create({
    
	container: {
		flex: 1,
		bottom: 0,
		left: 0,
		right: 0
	},
	loginPanel:{
		marginTop: Platform.OS === 'ios' ? 150 : 150,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	akbarLogo:{
		width: 140,
		height: 140,
	},
	benzyLogo:{
		width: 165,
		height: 65,

	},

	loginForeground: {
		paddingTop: 30,
		paddingLeft: 60,
		paddingRight: 60,
		width: '100%',
		height: 320,
	},

	signupBtn: {
		backgroundColor: '#30ACFF',
		color: '#FFF',
		marginBottom: 20
	},
	outlineBtn: {
		marginTop: 10,
		height: 30,
		backgroundColor: 'transparent',
	}
	 
});

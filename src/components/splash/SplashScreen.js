import React, { Component } from 'react';
import {  View, StyleSheet, Text } from 'react-native';
import { Bubbles } from 'react-native-loader';

export default class SplashScreen extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		this._subscribe = this.props.navigation.addListener('didFocus', () => {
			const { navigation } = this.props;
			setTimeout(() => {
				navigation.navigate('Login');
				// navigation.navigate('Camera');
			}, 1000);
		});
	}
 

	render() {
		// const { stores } = this.props;
		return (
			<View style={[styles.uploadProgress, {flex: 1}]}>
				<Bubbles size={10} color="#501094" />
				<Text style={styles.loadingText}>Please wait...</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	uploadProgress: {
		justifyContent: 'center',   
		alignItems: 'center',

	},
}); 

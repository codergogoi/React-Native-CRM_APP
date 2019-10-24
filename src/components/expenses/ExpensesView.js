import React, { Component } from 'react';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';

import { Container, Header, Title, Content, Left, Right, Body , Form, Item,Label, Input, Textarea } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, Alert, AsyncStorage, ScrollView, Platform } from 'react-native';
import MenuIcon from '../../images/menu_icon.png';
import FinishIcon from '../../images/finish_icon.png';
import UserIcon from '../../images/default_user.png';
import Store from '../../store/Stores';

import AddExpenseIcon from '../../images/add_task.png';
import {connect} from 'react-redux';

import { EMP_ID } from '../../store/actions/AppConst';

import { ViewExpenses } from '../../store/actions/ExpensesAction';
import ExpenseList from './ExpensesList';
import { BackHandler } from 'react-native';


class ExpensesView extends Component {
	
 
	constructor(props) {
		super(props);
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
			this.props.ViewExpenses({emp_id: EMP_ID()});
		});
	}

	onTapMenuButton = () => {
		this.props.navigation.openDrawer();
	}
 

	onTextChangeEvent = (event) => {

		if(event.target.id === "first_name"){
			this.setState({ first_name: event.target.value});
		}
	}

	onAddExpenses = () => {
		this.props.navigation.navigate('AddExpenses');
	}

	 
	  
	render() {

		const {expenses } = this.props;
 
		return (
			<SafeAreaView style={styles.container}>
				<Container style={{ backgroundColor: '#C8C8C8'}}>
				<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
						<Left>
							<TouchableOpacity onPress={this.onTapMenuButton}>
								<Image source={MenuIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Left>
						<Body>
							<Title style={styles.title}>Expenses </Title>
						</Body>
						<Right>
							<TouchableOpacity onPress={this.onAddExpenses}>
								<Image source={AddExpenseIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Right>
					</Header>
					<Content bounce={true} >
							<View style={styles.assignedTaskList}>
									{expenses !== undefined && <ExpenseList expenses={expenses} /> }
							</View>
					</Content>
				</Container>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	expenses: state.expensesReducer.expenses,
});

export default connect(mapStateToProps, { ViewExpenses })(ExpensesView);

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

	}
	 
});

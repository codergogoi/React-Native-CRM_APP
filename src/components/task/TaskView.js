import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { EMP_ID, PRINT } from '../../store/actions/AppConst';

import { connect } from 'react-redux';

import { Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, ScrollView, Platform } from 'react-native';
import MenuIcon from '../../images/menu_icon.png';
import AddTaskIcon from '../../images/add_task.png';
import TaskList from '../homepage/TaskList';
import { GetTask, ResetImageURI } from '../../store/actions/TaskActions';
import { BackHandler } from 'react-native';


class TaskView extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
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
	
	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}
	componentDidMount(){
		this._subscribe = this.props.navigation.addListener('didFocus', () => {
			this.props.ResetImageURI();
			this.setState({ emp_id: EMP_ID()})
			this.props.GetTask({emp_id: EMP_ID()});
		});
	}
 
	onTapMenuButton = () => {
		this.props.navigation.openDrawer();
	}

	onViewTaskDetails = (task) => {
		
		if(task.grouped === true){
			this.props.navigation.navigate('GroupTask', {task: task})
		}else{
			this.props.navigation.navigate('TaskDetails', {task: task})
		}
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

	onTapCompleted  = () => {
		this.setState({ filterIndex: 3});
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

		const { filterIndex} = this.state;

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
							<Title style={styles.title}>Task List</Title>
						</Body>
						<Right>
							<TouchableOpacity onPress={this.onPickTask}>
								<Image source={AddTaskIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Right>
					</Header>

					<View style={styles.assignedTask}>
						<View style={styles.sortView}>
							<TouchableOpacity onPress={this.onTapInProgress} 
								style={ filterIndex == 2 ? [styles.sortButtons, {borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: '#313a59'}] : [styles.sortButtons, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}>
								<View>
									<Text style={styles.taskSortText}>In-Progress</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity onPress={this.onTapPending} 
								style={ filterIndex == 1 ? [styles.sortButtons, {borderRadius: 0, backgroundColor: '#313a59'}] : [styles.sortButtons, {borderRadius: 0 }]}>
							<View >
								<Text style={styles.taskSortText}>Pending</Text>
							</View>
							</TouchableOpacity>
							
							<TouchableOpacity onPress={this.onTapCompleted} 
								style={ filterIndex == 3 ? [styles.sortButtons, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: '#313a59'}] : [styles.sortButtons, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}>
								<View>
									<Text style={styles.taskSortText}>Completed</Text>
								</View>
							</TouchableOpacity>
							
						</View>
					</View>	

					<Content bounce={true} >
							
							<View style={styles.assignedTaskList}>
								{this.currentTask(filterIndex) !== undefined && (<TaskList tasks={this.currentTask(filterIndex)} onViewTaskDetails={this.onViewTaskDetails} />)}
							</View>
					</Content>
				</Container>
			</SafeAreaView>
		);
	}
}


const mapStateToProps = (state) => ({
	tasks: state.taskReducer.tasks
});
 
export default connect(mapStateToProps, {GetTask, ResetImageURI})(TaskView);
 
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
	title: {
		fontSize: 16,
		color: '#000',
		alignItems: 'center',
	},
	assignedTaskList: {
		backgroundColor: '#C8C8C8',
		
	},
	assignedTask: {
		height: 40,
		backgroundColor: '#C8C8C8',
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
		backgroundColor: '#C8C8C8',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	sortView:{
		backgroundColor: '#C8C8C8',
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
	}
	 
});

